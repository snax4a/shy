import db from '../../utils/db';

// Returns JSON based on querystring params
export async function index(req, res) {
  const { rows } = await db.query('SELECT _id, name, description, active FROM classes ORDER BY name;', []);
  return res.status(200).send(rows);
}
