'use strict';
const db = require('../../db');

// Returns array of attendees
export async function attendees(req, res) {
  const { attended, location, teacher, classTitle } = req.query;
  const sql = `
    SELECT
      "Attendances"._id,
      "Attendances"."UserId",
      INITCAP("Users"."lastName" || ', ' || "Users"."firstName") AS name
    FROM
      "Attendances" INNER JOIN "Users" ON "Attendances"."UserId" = "Users"._id
    WHERE
      "Attendances".attended = $1::DATE AND
      "Attendances".location = $2 AND
      "Attendances".teacher = $3 AND
      "Attendances"."classTitle" = $4
    ORDER BY "Users"."lastName", "Users"."firstName";`;
  const { rows } = await db.query(sql, [attended, location, teacher, classTitle]);
  res.status(200).send(rows);
}

// Get a list of history items for a particular user with a running balance
export async function index(req, res) {
  const { id } = req.params;
  const sql = `
    SELECT history._id,
      history."UserId",
      history.type,
      history."when"::DATE,
      history.location,
      history."classTitle",
      history.teacher,
      history."paymentMethod",
      history.notes,
      history.what,
      history.quantity,
      (SUM(history.quantity) OVER (PARTITION BY history."UserId" ORDER BY history."when"))::integer AS balance
    FROM (
      SELECT "Attendances"._id,
        "Attendances"."UserId",
        'A'::text AS type,
        "Attendances".attended AS when,
        "Attendances".location,
        "Attendances"."classTitle",
        "Attendances".teacher,
        NULL AS "paymentMethod",
        NULL AS notes,
        ((((('Attended '::text || "Attendances"."classTitle"::text) || ' in '::text) || "Attendances".location::text) || ' ('::text) || "Attendances".teacher::text) || ')'::text AS what,
        '-1'::integer AS quantity
      FROM "Attendances"
      WHERE "Attendances"."UserId" = $1
      UNION
      SELECT "Purchases"._id,
        "Purchases"."UserId",
        'P'::text AS type,
        "Purchases"."createdAt"::DATE AS "when",
        NULL AS location,
        NULL AS "classTitle",
        NULL AS teacher,
        "Purchases".method AS "paymentMethod",
        "Purchases".notes,
        'Purchased '::text || "Purchases".quantity::text || ' class pass ('::text || "Purchases".method::text || ') - '::text || "Purchases".notes::text AS what,
        "Purchases".quantity
      FROM "Purchases"
      WHERE "Purchases"."UserId" = $1) history
    ORDER BY history."UserId", history."when" DESC;`;

  const { rows } = await db.query(sql, [id]);
  res.status(200).send(rows);
}

// Create history item (Attendance or Purchase) for a user
export async function create(req, res) {
  const { UserId, type } = req.body;
  let arrParams = [UserId];
  let sql;

  if(type == 'P') {
    const { quantity, method, notes, createdAt } = req.body;
    arrParams.push(quantity, method, notes, createdAt);
    sql = `INSERT INTO "Purchases" ("UserId", quantity, method, notes, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5::date, CURRENT_DATE) RETURNING _id;`;
  } else {
    const { attended, location, classTitle, teacher } = req.body;
    arrParams.push(attended, location, classTitle, teacher);
    sql = `INSERT INTO "Attendances" ("UserId", attended, location, "classTitle", teacher, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, CURRENT_DATE, CURRENT_DATE) RETURNING _id;`;
  }

  const { rows } = await db.query(sql, arrParams);
  res.status(200).send({ _id: rows[0]._id });
}

// Update history item based on its _id and type
export async function update(req, res) {
  const { _id, type, UserId } = req.body;
  let arrParams = [_id, UserId];
  let sql;

  if(type == 'P') {
    const { quantity, method, notes, createdAt } = req.body;
    arrParams.push(quantity, method, notes, createdAt);
    sql = `UPDATE "Purchases" SET
      "UserId" = $2, quantity = $3, method = $4,
      notes = $5, "createdAt" = $6::date, "updatedAt" = CURRENT_DATE
      WHERE _id = $1;`;
  } else {
    const { attended, location, classTitle, teacher } = req.body;
    arrParams.push(attended, location, classTitle, teacher);
    sql = `UPDATE "Attendances" SET
      "UserId" = $2, attended = $3::date, location = $4,
      "classTitle" = $5, teacher = $6, "updatedAt" = CURRENT_DATE
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
    sql = 'DELETE FROM "Purchases" WHERE _id = $1;';
  } else {
    sql = 'DELETE FROM "Attendances" WHERE _id = $1;';
  }

  await db.query(sql, [_id]);
  res.status(204).send({ _id });
}

// Authentication callback - is it needed?
// export function authCallback(req, res) {
//   return res.redirect('/');
// }
