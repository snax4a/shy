import db from '../../utils/db';

// Returns JSON array of upcoming workshops in chronological order
export async function index(req, res) {
  const { rows } = await db.query('SELECT * FROM workshop_sections;', []);
  return res.status(200).send(rows);
}

// Ingests JSON representation of workshop including sections (broken out from upsert() for testing)
export async function upsertWorkshop(workshop) {
  const { rows } = await db.query('SELECT workshop_upsert($1::json)', [workshop]);
  const { _id, imageId } = rows[0];
  const confirmation = {
    id: _id,
    imageId
  };
  return confirmation;
}

// Updates or creates workshop (admin-only)
export async function upsert(req, res) {
  // Check if workshop was sent
  if(!req.body.workshop) throw new Error('Did not receive JSON from client.');
  const _id = await upsertWorkshop(req.body.workshop);
  return res.status(200).send({ id: _id });
}

// Deletes workshop and cascades to sections (admin-only)
export async function destroy(req, res) {
  const _id = req.params.id;
  const sql = 'DELETE FROM workshops WHERE _id = $1;';
  await db.query(sql, [_id]);
  res.status(204).send({ message: `Workshop ${_id} deleted.`});
}
