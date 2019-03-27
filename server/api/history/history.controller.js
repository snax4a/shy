import db from '../../utils/db';

// Returns array of attendees
export async function attendees(req, res) {
  const { attended, locationid, teacherid, classid } = req.query; // all lowercase due to querystring key limitation
  const sql = 'SELECT _id, "userId", "userNameFull" FROM history_attendees($1, $2, $3, $4)';
  const { rows } = await db.query(sql, [attended, locationid, teacherid, classid]);
  return res.status(200).send(rows);
}

// Get a list of history items for a particular user with a running balance
export async function index(req, res) {
  const { id } = req.params;
  const sql = `SELECT _id, type, "when", "locationId", "classId", "teacherId", "paymentMethod",
    notes, what, quantity, balance FROM history_index($1);`;
  const { rows } = await db.query(sql, [id]);
  return res.status(200).send(rows);
}

// Create history item (Attendance or Purchase) for a user
export async function create(req, res) {
  const { userId, type } = req.body;
  let arrParams = [userId];
  let sql;

  if(type == 'P') {
    const { quantity, method, notes, purchased } = req.body;
    arrParams.push(quantity, method, notes, purchased);
    sql = `INSERT INTO purchases (user_id, quantity, method, notes, purchased)
      VALUES ($1, $2, $3, $4, $5) RETURNING _id;`;
  } else {
    const { attended, locationId, classId, teacherId } = req.body;
    arrParams.push(attended, locationId, classId, teacherId);
    sql = `INSERT INTO attendances (user_id, attended, location_id, class_id, teacher_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING _id;`;
  }

  const { rows } = await db.query(sql, arrParams);
  res.status(200).send({ _id: rows[0]._id });
}

// Update history item based on its _id and type
export async function update(req, res) {
  const { _id, type } = req.body;
  let arrParams = [_id];
  let sql;

  if(type == 'P') {
    const { quantity, method, notes, purchased } = req.body;
    arrParams.push(quantity, method, notes, purchased);
    sql = `UPDATE purchases SET
      quantity = $2, method = $3,
      notes = $4, purchased = $5::date
      WHERE _id = $1;`;
  } else {
    const { attended, locationId, classId, teacherId } = req.body;
    arrParams.push(attended, locationId, classId, teacherId);
    sql = `UPDATE attendances SET
      attended = $2::date, location_id = $3,
      class_id = $4, teacher_id = $5
      WHERE _id = $1;`;
  }

  await db.query(sql, arrParams);
  res.status(200).send({ _id });
}

// Delete history item based on its _id and type
export async function destroy(req, res) {
  const type = req.query.type;
  const _id = req.params.id;
  let sql;

  if(type == 'P') {
    sql = 'DELETE FROM purchases WHERE _id = $1;';
  } else {
    sql = 'DELETE FROM attendances WHERE _id = $1;';
  }

  await db.query(sql, [_id]);
  res.status(204).send({ _id });
}
