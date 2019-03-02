import db from '../../utils/db';

// Gets a list of Schedule items
export async function index(req, res) {
  // Not used but a great way to let PostgreSQL create the nested JSON
  // SELECT array_to_json(array_agg("LocationClasses" ORDER BY Location)) AS "FullSchedule" FROM (
  //   SELECT location, json_build_object('location', location, 'days', array_to_json(array_agg("LocationDayClasses" ORDER BY day))) AS "LocationClasses"
  //   FROM (
  //       SELECT location, day, json_build_object('day', day, 'classes', array_to_json(array_agg(json_build_object('title', title, 'teacher', teacher,'starts', timezone('US/Eastern', now()::date + ((day + 6 - EXTRACT(dow from now())::int) % 7) + "startTime") AS "startTime", 'ends', timezone('US/Eastern', now()::date + ((day + 6 - EXTRACT(dow from now())::int) % 7) + "endTime") AS "endTime", 'cancelled', canceled) ORDER BY "startTime"))) as "LocationDayClasses"
  //       FROM "Schedules"
  //       GROUP BY location, day
  //   ) T1
  //   GROUP BY location
  // ) T2
  const sql = `SELECT _id, location, day, title, teacher, canceled
      , timezone('US/Eastern', now()::date + ((day + 6 - EXTRACT(dow from now())::int) % 7) + "startTime") AS "startTime"
      , timezone('US/Eastern', now()::date + ((day + 6 - EXTRACT(dow from now())::int) % 7) + "endTime") AS "endTime"
    FROM "Schedules"
    ORDER BY location, day, "startTime";`;
  const { rows } = await db.query(sql, []);
  res.status(200).send(rows);
}

// Updates or creates schedule item (admin-only)
export async function upsert(req, res) {
  const { _id, location, day, title, teacher, startTime, endTime, canceled } = req.body;
  let arrParams = [location, day, title, teacher, startTime, endTime, canceled];
  let sql;
  const isNew = _id === 0;
  if(isNew) {
    sql = `INSERT INTO "Schedules"
      (location, day, title, teacher, "startTime", "endTime", canceled)
      VALUES ($1, $2, $3, $4,
        timezone('UTC', $5),
        timezone('UTC', $6),
        $7) RETURNING _id;`;
  } else {
    arrParams.push(_id);
    sql = `
      UPDATE "Schedules"
        SET location = $1, day = $2, title = $3, teacher = $4,
        "startTime" = timezone('UTC', $5),
        "endTime" = timezone('UTC', $6),
        canceled = $7
      WHERE _id = $8 RETURNING _id;`;
  }
  const { rows } = await db.query(sql, arrParams);
  return res.status(200).send({ _id: isNew ? rows[0]._id : _id });
}

export async function destroy(req, res) {
  const _id = req.params.id;
  const sql = 'DELETE FROM "Schedules" WHERE _id = $1;';
  await db.query(sql, [_id]);
  return res.status(204).send({ message: `Schedule Item ${_id} deleted.`});
}
