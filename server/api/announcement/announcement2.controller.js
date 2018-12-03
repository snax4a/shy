'use strict';

import * as db from '../../db';

// Passes JSON back so that UI fields can be flagged for validation issues
// function validationError(res, statusCode) {
//   statusCode = statusCode || 422;
//   return err => res.status(statusCode).json(err);
// }

// function handleEntityNotFound(res) {
//   return function(entity) {
//     if(!entity) {
//       res.status(404).end();
//       return null;
//     }
//     return entity;
//   };
// }

// function removeEntity(res) {
//   return function(entity) {
//     if(entity) {
//       return entity.destroy()
//         .then(() => res.status(204).end());
//     }
//     throw new Error('Entity to remove was not provided'); // handleEntityNotFound should have prevented this
//   };
// }

// function handleError(res, statusCode) {
//   statusCode = statusCode || 500;
//   return err => res.status(statusCode).send(err);
// }

// Gets a list of Announcements
export async function index(req, res) {
  const flat = req.query.flat;
  const { announcements } = await db.query('SELECT _id, section, title, description, expires FROM "Announcements" WHERE expires > CURRENT_DATE ORDER BY section, expires;');
  return flat ? res.status(200).json(announcements) : res.status(200).json(nest(announcements));
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
export async function upsert(req, res) {
  const { _id, section, title, description, expires } = req.body;
  const isNew = _id === 0; // zero means INSERT
  let sql = '';

  if(isNew) {
    sql = 'INSERT INTO "Announcements" (section, title, description, expires) VALUES ($2, $3, $4, $5);';
  } else {
    sql = 'UPDATE "Announcements" SET section = $2, title = $3, description = $4, expires = $5 WHERE _id = $1';
  }
  const { results } = await db.query(sql, [_id, section, title, description, expires]);
  // TODO: Get new ID value if there was an INSERT based on https://github.com/brianc/node-postgres/wiki/FAQ#7-i-just-have-a-question-and-maybe-a-feature-request-that-i-am-not-able-to-think-about-how-to-implement-or-do-it-i-need-to-retrieve-the-inserted-row-or-someway-to-reach-it-after-the-insert-is-done

  if(isNew) Reflect.deleteProperty(req.body, '_id');
  let announcementToUpsert = Announcement.build(req.body);
  announcementToUpsert.isNewRecord = isNew;

  return announcementToUpsert.save()
    .then(announcement => res.status(200).json({ _id: announcement._id }))
    .catch(validationError(res));
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

// Authentication callback
export function authCallback(req, res) {
  res.redirect('/');
}
