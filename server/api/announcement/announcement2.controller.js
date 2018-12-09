'use strict';
const db = require('../../db');

// Utility function to return nested JSON from flat list
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

// Returns list of Announcements
export async function index(req, res) {
  const { rows } = await db.query('SELECT _id, section, title, description, expires FROM "Announcements" WHERE expires > CURRENT_DATE ORDER BY section, expires;');
  return req.query.flat ? res.status(200).json(rows) : res.status(200).json(nest(rows));
}

// Updates or creates announcement (admin-only)
export async function upsert(req, res) {
  const { _id, section, title, description, expires } = req.body;
  const isNew = _id === 0; // zero means INSERT
  let sql;

  if(isNew) {
    sql = 'INSERT INTO "Announcements" (section, title, description, expires) VALUES ($2, $3, $4, $5);';
  } else {
    sql = 'UPDATE "Announcements" SET section = $2, title = $3, description = $4, expires = $5 WHERE _id = $1;';
  }
  const { rows } = await db.query(sql, [_id, section, title, description, expires]);
  res.status(200).json({ _id: rows[0].id });
}

// Deletes announcement (admin-only)
export async function destroy(req, res) {
  const _id = req.params.id;
  const sql = 'DELETE FROM "Announcements" WHERE _id = $1;';
  await db.query(sql, [_id]);
  res.status(200).json({ message: `Announcement ${_id} deleted.`});
}

// Authentication callback
export function authCallback(req, res) {
  res.redirect('/');
}
