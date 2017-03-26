'use strict';

import { Schedule } from '../../sqldb';

// Passes JSON back so that UI fields can be flagged for validation issues
function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return err => res.status(statusCode).json(err);
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return err => res.status(statusCode).send(err);
}

// Gets a list of Schedule items
export function index(req, res) {
  let flat = req.query.flat;
  return Schedule.findAll({
    attributes: ['_id', 'location', 'day', 'title', 'teacher', 'startTime', 'endTime'],
    order: ['location', 'day', 'startTime']
  })
    .then(schedule => {
      return flat ? res.status(200).json(schedule) : res.status(200).json(nest(schedule));
    })
    .catch(handleError(res));
}

// Overhaul for schedule
function nest(flatScheduleItems) {
  let nestedScheduleItems = [];
  let currentLocation;
  let locationIndex;
  let currentDay;
  let dayIndex;

  for(let i = 0; i < flatScheduleItems.length; i++) {
    let row = flatScheduleItems[i];
    if(currentLocation !== row.location) {
      locationIndex = i;
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
        dayIndex = i;
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
    currentLocation = row.location;
  }
  return nestedScheduleItems;
}

// Updates or creates schedule item (admin-only)
export function upsert(req, res) {
  // New schedule items are flagged with _id of zero, strip it before Schedule.save()
  const isNew = req.body._id === 0;
  if(isNew) Reflect.deleteProperty(req.body, '_id');
  let scheduleItemToUpsert = Schedule.build(req.body);
  scheduleItemToUpsert.isNewRecord = isNew;

  return scheduleItemToUpsert.save()
    .then(scheduleItem => res.status(200).json({ _id: scheduleItem._id }))
    .catch(validationError(res));
}

// Deletes schedule item (admin-only)
export function destroy(req, res) {
  return Schedule.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.destroy()
        .then(() => {
          res.status(204).end();
          return null;
        });
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if(!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

// Authentication callback
export function authCallback(req, res) {
  res.redirect('/');
}
