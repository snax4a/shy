'use strict';

import Sequelize from 'sequelize';
import { Announcement } from '../../sqldb';
const Op = Sequelize.Op;

// Passes JSON back so that UI fields can be flagged for validation issues
function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return err => res.status(statusCode).json(err);
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

function removeEntity(res) {
  return function(entity) {
    if(entity) {
      return entity.destroy()
        .then(() => res.status(204).end());
    }
    throw new Error('Entity to remove was not provided'); // handleEntityNotFound should have prevented this
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return err => res.status(statusCode).send(err);
}

// Gets a list of Announcements
export function index(req, res) {
  let flat = req.query.flat;
  return Announcement.findAll({
    attributes: ['_id', 'section', 'title', 'description', 'expires'],
    order: ['section', 'expires'],
    where: { expires: { [Op.gt]: new Date() } }
  })
    .then(function(announcements) {
      return flat ? res.status(200).json(announcements) : res.status(200).json(nest(announcements));
    })
    .catch(handleError(res));
}

function nest(flatAnnouncements) {
  let nestedAnnouncements = [];
  let currentSection;
  let sectionIndex = -1;

  for(let i = 0; i < flatAnnouncements.length; i++) {
    let row = flatAnnouncements[i];
    if(currentSection !== row.section) {
      sectionIndex++;
      nestedAnnouncements.push({
        section: row.section,
        announcements: [
          {
            title: row.title,
            description: row.description,
            expires: row.expires
          }
        ]
      });
    } else {
      nestedAnnouncements[sectionIndex].announcements.push({
        title: row.title,
        description: row.description,
        expires: row.expires
      });
    }
    currentSection = row.section;
  }
  return nestedAnnouncements;
}

// Updates or creates announcement (admin-only)
export function upsert(req, res) {
  // New announcements are flagged with _id of zero, strip it before Announcement.save()
  const isNew = req.body._id === 0;
  if(isNew) Reflect.deleteProperty(req.body, '_id');
  let announcementToUpsert = Announcement.build(req.body);
  announcementToUpsert.isNewRecord = isNew;

  return announcementToUpsert.save()
    .then(announcement => res.status(200).json({ _id: announcement._id }))
    .catch(validationError(res));
}

// Deletes announcement (admin-only)
export function destroy(req, res) {
  return Announcement.findOne({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}

// Authentication callback
export function authCallback(req, res) {
  res.redirect('/');
}
