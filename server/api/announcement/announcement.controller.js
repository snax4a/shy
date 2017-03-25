'use strict';

import { Announcement } from '../../sqldb';

// Passes JSON back so that UI fields can be flagged for validation issues
function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return err => res.status(statusCode).json(err);
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return err => res.status(statusCode).send(err);
}

class AnnouncementError extends Error {
  constructor(message, path) {
    super(message);
    this.message = message;
    this.name = 'AnnouncementError';
    this.errors = [{message, path}];
    Error.captureStackTrace(this, this.constructor);
  }
}

// Gets a list of Announcements (need a flag for a flat list vs. group by section)
export function index(req, res) {
  let flat = req.query.flat;
  return Announcement.findAll({
    attributes: ['_id', 'section', 'title', 'description', 'expires'],
    order: ['section', 'title'],
    where: { expires: { $gt: new Date() } },
  })
    .then(announcements => {
      return flat ? res.status(200).json(announcements) : res.status(200).json(nest(announcements));
    })
    .catch(handleError(res));
}

function nest(flatAnnouncements) {
  let nestedAnnouncements = [];
  let currentSection;
  let sectionIndex;

  for(let i = 0; i < flatAnnouncements.length; i++) {
    let row = flatAnnouncements[i];
    if(currentSection !== row.section) {
      sectionIndex = i;
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

// Deletes announcement (admin-only)
export function destroy(req, res) {
  return Announcement.find({
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
