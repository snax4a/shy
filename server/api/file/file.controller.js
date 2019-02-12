import stream from 'stream';
import fs from 'fs';
import { IncomingForm } from 'formidable';
import db from '../../utils/db';

// Returns list of images
export async function index(req, res) {
  const { rows } = await db.query('SELECT _id, name, type FROM files ORDER BY name;', []);
  return res.status(200).send(rows);
}

// Uploads a single image
export async function upload(req, res) {
  const uploadHandler = new IncomingForm();

  // Needed if I want to assign a specific location for the upload
  uploadHandler.on('fileBegin', (field, file) => {
    file.path = `${__dirname}/uploads/${file.name}`;
    console.log('Saving upload to: ', file.path);
  });

  // Handle the upload
  uploadHandler.parse(req);

  // Take uploaded file and put in PostgreSQL per // https://stackoverflow.com/questions/13124711/storing-a-file-in-postgres-using-node-postgres
  uploadHandler.on('file', (field, file) => {
    const { name, type } = file;
    fs.readFile(file.path, 'hex', (err, fileData) => {
      if(err) throw err;
      fileData = `\\x${fileData}`;
      const sql = 'INSERT INTO files (name, type, data) VALUES($1, $2, $3);';
      db.query(sql, [name, type, fileData]);
    });
    console.log(`Uploaded ${file.name}`);
  });

  // If I want to do something after multiple images are uploaded
  uploadHandler.on('end', () => {
    console.log('Finished all uploads');
  });
}

// Downloads an image by its _id
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
