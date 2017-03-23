'use strict';

import { Announcement } from '../../sqldb';

// Passes JSON back so that UI fields can be flagged for validation issues
function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return err => {
    res.status(statusCode).json(err);
  };
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

// Gets a list of Announcements
export function index(req, res) {
  let startsWith = `${req.query.filter}%`;
  return Announcement.findAll({
    // FIX HERE!
    where: { expires: { $iLike: startsWith } },
    attributes: ['section', 'title', 'description', 'expires']
  })
    .then(announcements => res.status(200).json(announcements))
    .catch(handleError(res));
}
