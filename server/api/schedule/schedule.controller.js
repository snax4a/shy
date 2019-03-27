import db from '../../utils/db';

class ScheduleError extends Error {
  constructor(message, path, status) {
    super(message);
    this.message = message;
    this.status = status;
    this.name = 'ScheduleError';
    this.errors = [{ message, path }];
    Error.captureStackTrace(this, this.constructor);
  }
}
// Gets a list of Schedule items
export async function index(req, res) {
  // Not used but a great way to let PostgreSQL create the nested JSON
  // SELECT array_to_json(array_agg("LocationClasses" ORDER BY Location)) AS "FullSchedule" FROM (
  //   SELECT location, json_build_object('location', location, 'days', array_to_json(array_agg("LocationDayClasses" ORDER BY day))) AS "LocationClasses"
  //   FROM (
  //       SELECT location, day, json_build_object('day', day, 'classes', array_to_json(array_agg(json_build_object('title', title, 'teacher', teacher,'starts', timezone('US/Eastern', now()::date + ((day + 6 - EXTRACT(dow from now())::int) % 7) + "startTime") AS "startTime", 'ends', timezone('US/Eastern', now()::date + ((day + 6 - EXTRACT(dow from now())::int) % 7) + "endTime") AS "endTime", 'cancelled', canceled) ORDER BY "startTime"))) as "LocationDayClasses"
  //       FROM schedules
  //       GROUP BY location, day
  //   ) T1
  //   GROUP BY location
  // ) T2
  const sql = 'SELECT * FROM schedules_index;';
  const { rows } = await db.query(sql, []);
  res.status(200).send(rows);
}

// Updates or creates schedule item (admin-only)
export async function upsert(req, res) {
  const { _id, locationId, day, classId, teacherId, startTime, endTime, canceled } = req.body;
  let arrParams = [locationId, day, classId, teacherId, startTime, endTime, canceled];
  let sql;
  const isNew = _id === 0;
  if(isNew) {
    sql = `INSERT INTO schedules
      (location_id, day, class_id, teacher_id, "startTime", "endTime", canceled)
      VALUES ($1, $2, $3, $4, $5::time without time zone, $6::time without time zone, $7)
      RETURNING _id;`;
  } else {
    arrParams.push(_id);
    sql = `
      UPDATE schedules
        SET location_id = $1, day = $2, class_id = $3, teacher_id = $4,
        "startTime" = $5::time without time zone,
        "endTime" = $6::time without time zone,
        canceled = $7
      WHERE _id = $8 RETURNING _id;`;
  }
  try {
    const { rows } = await db.query(sql, arrParams);
    return res.status(200).send({ _id: isNew ? rows[0]._id : _id });
  } catch(err) {
    let fields = err.message.match(/(teacher|location|class)/ig);
    throw new ScheduleError(err.message, fields[0], 503);
  }
}

export async function destroy(req, res) {
  const _id = req.params.id;
  const sql = 'DELETE FROM schedules WHERE _id = $1;';
  await db.query(sql, [_id]);
  return res.status(204).send({ message: `Schedule Item ${_id} deleted.`});
}
