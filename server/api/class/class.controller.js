import db from '../../utils/db';

// Returns list of Classes
export async function index(req, res) {
  const { rows } = await db.query('SELECT _id, name, description, active FROM classes ORDER BY name;', []);
  return res.status(200).send(rows);
}

export async function activeClassesGet() {
  const { rows } = await db.query('SELECT _id, name, description FROM classes WHERE active = true ORDER BY _id;', []);
  return rows;
}

// Returns list of active Products
export async function activeClasses(req, res) {
  const classes = await activeClassesGet();
  return res.status(200).send(classes);
}

export async function upsertClass(classToUpsert) {
  const { _id, name, description, active } = classToUpsert;
  const isNew = _id === 0; // zero means INSERT
  let arrParams = [name, description, active];
  let sql;
  if(isNew) {
    sql = 'INSERT INTO classes (name, description, active) VALUES ($1, $2, $3) RETURNING _id;';
  } else {
    sql = 'UPDATE classes SET name = $2, description = $3, active = $4 WHERE _id = $1 RETURNING _id;';
    arrParams.unshift(_id);
  }
  const { rows } = await db.query(sql, arrParams);
  return rows[0]._id;
}

// Updates or creates class (admin-only)
export async function upsert(req, res) {
  const _id = await upsertClass(req.body);
  return res.status(200).send({ _id });
}

// Deletes class (admin-only)
export async function destroy(req, res) {
  const _id = req.params.id;
  const sql = 'DELETE FROM classes WHERE _id = $1;';
  await db.query(sql, [_id]);
  res.status(204).send({ message: `Class ${_id} deleted.`});
}
