import stream from 'stream';
import fs from 'fs';
import { IncomingForm } from 'formidable';
import db from '../../utils/db';

// Returns list of images
export async function index(req, res) {
  const { rows } = await db.query('SELECT _id, name, type FROM files ORDER BY name;', []);
  return res.send(rows);
}

// Uploads a single file
export async function upload(req, res) {
  let _id;
  new IncomingForm().parse(req, (err, fields, files) => {
    if(err) throw err;
    if(Array.isArray(files)) throw new Error('Only one file can be uploaded at a time');
    const { name, type, path } = files.file;
    fs.readFile(path, 'hex', async(err, fileData) => {
      if(err) throw err;
      fileData = `\\x${fileData}`;
      const sql = 'INSERT INTO files (name, type, data) VALUES($1, $2, $3) RETURNING _id;';
      const { rows } = await db.query(sql, [name, type, fileData]);
      _id = rows[0]._id;
      res.send({ id: _id });
      // TODO: remove next line
      console.log(`Uploaded ${name} to ${path} and inserted into database (ID = ${_id})`);
    });
  });
}

// Downloads a file by its _id
export async function download(req, res) {
  const _id = req.params.id;
  const sql = 'SELECT _id, name, type, data FROM files WHERE _id = $1;';
  const { rows } = await db.query(sql, [_id]);
  const file = rows[0];
  const fileContents = Buffer.from(file.data, 'base64');
  const readStream = new stream.PassThrough();
  readStream.end(fileContents);
  res.set('Content-disposition', `attachment; filename=${file.name}`);
  res.set('Content-Type', file.type);
  readStream.pipe(res);
  return rows[0];
}

// Deletes an image (admin-only)
export async function destroy(req, res) {
  const _id = req.params.id;
  const sql = 'DELETE FROM files WHERE _id = $1;';
  await db.query(sql, [_id]);
  res.status(204).send({ message: `Image ${_id} deleted.`});
}
