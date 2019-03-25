import db from '../../utils/db';

// Returns array of attendees
export async function attendees(req, res) {
  const { attended, location, teacher, className } = req.query;
  const sql = `
    SELECT
      attendances._id,
      attendances.user_id AS "userId",
      INITCAP(users."lastName" || ', ' || users."firstName") AS name
    FROM
      attendances INNER JOIN users ON attendances.user_id = users._id
    WHERE
      attendances.attended = $1::DATE AND
      attendances.location = $2 AND
      attendances.teacher = $3 AND
      attendances."className" = $4
    ORDER BY users."lastName", users."firstName";`;
  const { rows } = await db.query(sql, [attended, location, teacher, className]);
  res.status(200).send(rows);
}

// Get a list of history items for a particular user with a running balance
export async function index(req, res) {
  const { id } = req.params;
  const sql = `
    SELECT history._id,
      history."userId",
      history.type,
      history."when",
      history.location,
      history."className",
      history.teacher,
      history."paymentMethod",
      history.notes,
      history.what,
      history.quantity,
      (SUM(history.quantity) OVER (PARTITION BY history."userId" ORDER BY history."when"))::integer AS balance
    FROM (
      SELECT attendances._id,
        attendances.user_id AS "userId",
        'A'::text AS type,
        attendances.attended AS when,
        attendances.location,
        attendances."className",
        attendances.teacher,
        NULL AS "paymentMethod",
        NULL AS notes,
        ((((('Attended '::text || attendances."className"::text) || ' in '::text) || attendances.location::text) || ' ('::text) || attendances.teacher::text) || ')'::text AS what,
        '-1'::integer AS quantity
      FROM attendances
      WHERE attendances.user_id = $1
      UNION
      SELECT purchases._id,
        purchases.user_id AS "userId",
        'P'::text AS type,
        purchases.purchased AS "when",
        NULL AS location,
        NULL AS "className",
        NULL AS teacher,
        purchases.method AS "paymentMethod",
        purchases.notes,
        'Purchased '::text || purchases.quantity::text || ' class pass ('::text || purchases.method::text || ') - '::text || purchases.notes::text AS what,
        purchases.quantity
      FROM purchases
      WHERE purchases.user_id = $1) history
    ORDER BY history."when" DESC;`;

  const { rows } = await db.query(sql, [id]);
  res.status(200).send(rows);
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
    const { attended, location, className, teacher } = req.body;
    arrParams.push(attended, location, className, teacher);
    sql = `INSERT INTO attendances (user_id, attended, location, "className", teacher)
      VALUES ($1, $2, $3, $4, $5) RETURNING _id;`;
  }

  const { rows } = await db.query(sql, arrParams);
  res.status(200).send({ _id: rows[0]._id });
}

// Update history item based on its _id and type
export async function update(req, res) {
  const { _id, type, userId } = req.body;
  let arrParams = [_id, userId];
  let sql;

  if(type == 'P') {
    const { quantity, method, notes, purchased } = req.body;
    arrParams.push(quantity, method, notes, purchased);
    sql = `UPDATE purchases SET
      user_id = $2, quantity = $3, method = $4,
      notes = $5, purchased = $6::date
      WHERE _id = $1;`;
  } else {
    const { attended, location, className, teacher } = req.body;
    arrParams.push(attended, location, className, teacher);
    sql = `UPDATE attendances SET
      user_id = $2, attended = $3::date, location = $4,
      "className" = $5, teacher = $6
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
