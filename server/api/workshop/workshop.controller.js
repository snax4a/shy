import db from '../../utils/db';

// Returns JSON array of upcoming workshops in chronological order
export async function index(req, res) {
  const { rows } = await db.query('SELECT * FROM workshop_sections;', []);
  return res.status(200).send(rows[0].workshops);
}

// Ingests JSON representation of workshop including sections (broken out from upsert() for testing)
export async function upsertWorkshop(workshop) {
  const jsonWorkshop = JSON.stringify(workshop);
  const { rows } = await db.query('SELECT * FROM workshop_upsert_json($1::json)', [jsonWorkshop]);
  return rows[0];
}

// Updates or creates workshop (admin-only)
export async function upsert(req, res) {
  // Check if workshop was sent
  if(!req.body) throw new Error('Did not receive JSON from client.');
  const response = await upsertWorkshop(req.body);
  return res.status(200).send(response);
}

// Deletes workshop and cascades to sections (admin-only)
export async function destroy(req, res) {
  const _id = req.params.id;
  const sql = 'DELETE FROM workshops WHERE _id = $1;';
  await db.query(sql, [_id]);
  res.status(204).send({ message: `Workshop ${_id} deleted.`});
}
