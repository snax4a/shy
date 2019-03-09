import db from '../../utils/db';

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
  const { rows } = await db.query('SELECT _id, section, title, description, expires FROM announcements WHERE expires > CURRENT_DATE ORDER BY section, expires;', []);
  return req.query.flat ? res.status(200).send(rows) : res.status(200).send(nest(rows));
}

export async function upsertAnnouncement(announcement) {
  const { _id, section, title, description, expires } = announcement;
  const isNew = _id === 0; // zero means INSERT
  let arrParams = [section, title, description, new Date(expires).toISOString()];
  let sql;
  if(isNew) {
    sql = 'INSERT INTO announcements (section, title, description, expires) VALUES ($1, $2, $3, $4::date) RETURNING _id;';
  } else {
    sql = 'UPDATE announcements SET section = $2, title = $3, description = $4, expires = $5::date WHERE _id = $1 RETURNING _id;';
    arrParams.unshift(_id);
  }
  const { rows } = await db.query(sql, arrParams);
  return rows[0]._id;
}

// Updates or creates announcement (admin-only)
export async function upsert(req, res) {
  const _id = await upsertAnnouncement(req.body);
  return res.status(200).send({ _id });
}

// Deletes announcement (admin-only)
export async function destroy(req, res) {
  const _id = req.params.id;
  const sql = 'DELETE FROM announcements WHERE _id = $1;';
  await db.query(sql, [_id]);
  res.status(204).send({ message: `Announcement ${_id} deleted.`});
}
