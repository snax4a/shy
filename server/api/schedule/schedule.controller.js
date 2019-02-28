import db from '../../utils/db';

// Nest the schedule items for easy display with AngularJS
function nest(flatScheduleItems) {
  let nestedScheduleItems = [];
  let currentLocation;
  let locationIndex = -1; // assume none
  let currentDay;
  let dayIndex;

  for(let i in flatScheduleItems) {
    let row = flatScheduleItems[i];
    if(currentLocation !== row.location) {
      locationIndex++; // zero first time through
      dayIndex = 0; // Start days over for new location
      nestedScheduleItems.push({
        location: row.location,
        days: [
          {
            day: row.day,
            classes: [
              {
                title: row.title,
                teacher: row.teacher,
                startTime: row.startTime,
                endTime: row.endTime,
                canceled: row.canceled
              }
            ]
          }
        ]
      });
    } else {
      if(currentDay !== row.day) {
        dayIndex++;
        nestedScheduleItems[locationIndex].days.push({
          day: row.day,
          classes: [
            {
              title: row.title,
              teacher: row.teacher,
              startTime: row.startTime,
              endTime: row.endTime,
              canceled: row.canceled
            }
          ]
        });
      } else {
        nestedScheduleItems[locationIndex].days[dayIndex].classes.push({
          title: row.title,
          teacher: row.teacher,
          startTime: row.startTime,
          endTime: row.endTime,
          canceled: row.canceled
        });
      }
      currentDay = row.day;
    }
    currentDay = row.day;
    currentLocation = row.location;
  }
  return nestedScheduleItems;
}

// Gets a list of Schedule items
export async function index(req, res) {
  const { flat } = req.query;
  const sql = `SELECT _id, location, day, title, teacher, canceled
      , timezone('US/Eastern', now()::date + ((day + 6 - EXTRACT(dow from now())::int) % 7) + "startTime") AS "startTime"
      , timezone('US/Eastern', now()::date + ((day + 6 - EXTRACT(dow from now())::int) % 7) + "endTime") AS "endTime"
    FROM "Schedules"
    ORDER BY location, day, "startTime";`;
  const { rows } = await db.query(sql, []);
  return flat ? res.status(200).send(rows) : res.status(200).send(nest(rows));
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
