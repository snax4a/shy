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

// Groups a flat array into a tree.
// "data" is the flat array.
// "keys" is an array of properties to group on.
function groupBy(data, keys) {
  if(keys.length == 0) return data;

  // The current key to perform the grouping on:
  let key = keys[0];

  // Loop through the data and construct buckets for
  // all of the unique keys:
  let groups = {};
  for(let i = 0; i < data.length; i++) {
    let row = data[i];
    let groupValue = row[key];

    if(groups[groupValue] == undefined) groups[groupValue] = [];

    groups[groupValue].push(row);
  }

  // Remove the first element from the groups array:
  keys.reverse();
  keys.pop();
  keys.reverse();

  // If there are no more keys left, we're done:
  if(keys.length == 0) return groups;

  // Otherwise, handle further groupings:
  for(let group in groups) {
    groups[group] = groupBy(groups[group], keys.slice());
  }

  return groups;
}
// Gets a list of Announcements (need a flag for a flat list vs. group by section)
export function index(req, res) {
  return Announcement.findAll({
    attributes: ['section', 'title', 'description', 'expires'],
    order: ['section', 'title'],
    where: { expires: { $gt: new Date() } },
  })
    .then(announcements => res.status(200).json(groupBy(announcements, ['section'])))
    .catch(handleError(res));
}
