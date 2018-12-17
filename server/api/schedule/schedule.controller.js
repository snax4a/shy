'use strict';

import { Schedule } from '../../sqldb';

// Nest the schedule items for easy display with AngularJS
function nest(flatScheduleItems) {
  let nestedScheduleItems = [];
  let currentLocation;
  let locationIndex = -1; // assume none
  let currentDay;
  let dayIndex;

  for(let i = 0; i < flatScheduleItems.length; i++) {
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
  let flat = req.query.flat;
  const schedule = await Schedule.findAll({
    attributes: ['_id', 'location', 'day', 'title', 'teacher', 'startTime', 'endTime', 'canceled'],
    order: ['location', 'day', 'startTime']
  });
  return flat ? res.status(200).send(schedule) : res.status(200).send(nest(schedule));
}

// Updates or creates schedule item (admin-only)
export async function upsert(req, res) {
  // New schedule items are flagged with _id of zero, strip it before Schedule.save()
  const isNew = req.body._id === 0;
  if(isNew) Reflect.deleteProperty(req.body, '_id');
  let scheduleItemToUpsert = Schedule.build(req.body);
  scheduleItemToUpsert.isNewRecord = isNew;

  const scheduleItem = await scheduleItemToUpsert.save();
  res.status(200).send({ _id: scheduleItem._id });
}

// Deletes schedule item (admin-only)
export async function destroy(req, res) {
  await Schedule.destroy({
    where: {
      _id: req.params.id
    }
  });
  res.status(204).end();
}

// Authentication callback - is it needed?
// export function authCallback(req, res) {
//   return res.redirect('/');
// }
