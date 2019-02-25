import db from '../../utils/db';

// Returns JSON based on querystring params
export async function index(req, res) {
  const reports = {
    top10classes: `SELECT location, "className", teacher, count(*) from "Attendances"
      WHERE attended > CURRENT_DATE - INTERVAL '90 days'
      GROUP BY "className", location, teacher
      ORDER by count(*) DESC
      LIMIT 10;`,
    schoolspie: `SELECT location, count(*) from "Attendances"
      WHERE attended > CURRENT_DATE - INTERVAL '90 days'
      GROUP BY location
      ORDER by count(*) DESC;`,
    attendancelast90: `SELECT location, date_trunc('week', attended)::date AS week, COUNT(*) FROM "Attendances"
      WHERE attended > CURRENT_DATE - INTERVAL '90 days'
      GROUP BY location, attended
      ORDER BY COUNT(*) DESC;`,
    top10students: `SELECT "Users"."lastName", "Users"."firstName", COUNT(*) FROM "Attendances"
      INNER JOIN "Users" ON "Attendances"."UserId" = "Users"._id
      WHERE attended > CURRENT_DATE - INTERVAL '90 days'
      GROUP BY "Users"."lastName", "Users"."firstName"
      ORDER BY COUNT(*) DESC
      LIMIT 10;`
  };

  const reportName = req.query.name;

  if(!reports.hasOwnProperty(reportName)) throw new Error('That report does not exist.');

  const { rows } = await db.query(reports[reportName], []);
  return res.status(200).send(rows);
}
