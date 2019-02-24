import db from '../../utils/db';

// Returns list of Locations
export async function index(req, res) {
  const { rows } = await db.query('SELECT _id, name, address, city, state, "zipCode", map, street, directions, review, note1, note2, active FROM locations ORDER BY name;', []);
  return res.status(200).send(rows);
}

export async function activeLocationsGet() {
  const { rows } = await db.query('SELECT _id, name, address, city, state, "zipCode", map, street, directions, review, note1, note2 FROM locations WHERE active = true ORDER BY name;', []);
  return rows;
}

// Returns list of active Locations
export async function activeLocations(req, res) {
  const locations = await activeLocationsGet();
  return res.status(200).send(locations);
}

export async function upsertLocation(location) {
  const { _id, name, address, city, state, zipCode, map, street, directions, review, note1, note2, active } = location;
  const isNew = _id === 0; // zero means INSERT
  let arrParams = [name, address, city, state, zipCode, map, street, directions, review, note1, note2, active];
  let sql;
  if(isNew) {
    sql = `INSERT INTO locations (name, address, city, state, "zipCode", map, street, directions, review, note1, note2, active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING _id;`;
  } else {
    sql = `UPDATE locations SET name = $2, address = $3, city = $4, state = $5, "zipCode" = $6, map = $7,
      street = $8, directions = $9, review = $10, note1 = $11, note2 = $12, active = $13 WHERE _id = $1 RETURNING _id;`;
    arrParams.unshift(_id);
  }
  const { rows } = await db.query(sql, arrParams);
  return rows[0]._id;
}

// Updates or creates location (admin-only)
export async function upsert(req, res) {
  const _id = await upsertLocation(req.body);
  return res.status(200).send({ _id });
}

// Deletes location (admin-only)
export async function destroy(req, res) {
  const _id = req.params.id;
  const sql = 'DELETE FROM locations WHERE _id = $1;';
  await db.query(sql, [_id]);
  res.status(204).send({ message: `Location ${_id} deleted.`});
}
