import db from '../../utils/db';

export async function csv(req, res) {
  await db.toCsv(res, `
    SELECT location, teacher, "className", attended, COUNT(*) AS count,
      CASE
        WHEN COUNT(*) < 5 THEN 25
        ELSE COUNT(*) * 5
      END as amount
    FROM "Attendances"
    WHERE
      attended >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' AND attended < date_trunc('month', CURRENT_DATE)
    GROUP BY location, teacher, "className", attended ORDER BY location, teacher, "className"`);
}

// Returns JSON based on querystring params
export async function index(req, res) {
  const reports = {
    top10classes: `SELECT location, "className", teacher, count(*) from "Attendances"
      WHERE attended > CURRENT_DATE - INTERVAL '90 days'
      GROUP BY "className", location, teacher
      ORDER by count(*) DESC
      LIMIT 10;`,
    bottom10classes: `SELECT location, "className", teacher, count(*) from "Attendances"
      INNER JOIN "Users" on "Attendances".teacher = "Users"."lastName" || ', ' || "Users"."firstName"
      WHERE attended > CURRENT_DATE - INTERVAL '90 days' AND "Users"."displayOrder" IS NOT NULL
      GROUP BY "className", teacher, location
      ORDER by count(*) ASC
      LIMIT 10;`,
    schoolspie: `SELECT location, count(*) from "Attendances"
      WHERE attended > CURRENT_DATE - INTERVAL '90 days'
      GROUP BY location
      ORDER by count(*) DESC;`,
    top10students: `SELECT "Users"."lastName", "Users"."firstName", COUNT(*) FROM "Attendances"
      INNER JOIN "Users" ON "Attendances"."UserId" = "Users"._id
      WHERE attended > CURRENT_DATE - INTERVAL '90 days'
      GROUP BY "Users"."lastName", "Users"."firstName"
      ORDER BY COUNT(*) DESC
      LIMIT 10;`,
    attendancelast18m: `SELECT location, date_trunc('month', attended)::date AS month, COUNT(*) FROM "Attendances"
      WHERE attended >= date_trunc('month', CURRENT_DATE) - INTERVAL '18 months' AND attended < date_trunc('month', CURRENT_DATE)
      GROUP BY location, month
      ORDER BY location, month;`,
    attendeesnhpq: 'SELECT count FROM attendees_nh_pq;',
    teacherpay: `SELECT teacher, SUM(count) AS count, SUM(amount) AS amount FROM
      ( SELECT teacher, "className", attended, COUNT(*) AS count,
          CASE
            WHEN COUNT(*) < 5 THEN 25
            ELSE COUNT(*) * 5
          END as amount
        FROM "Attendances"
        WHERE
          attended >= date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' AND attended < date_trunc('month', CURRENT_DATE)
        GROUP BY teacher, "className", attended) a
      GROUP by teacher
      ORDER BY teacher;`
  };

  const reportName = req.query.name;

  if(!reports.hasOwnProperty(reportName)) throw new Error('That report does not exist.');

  const { rows } = await db.query(reports[reportName], []);
  return res.status(200).send(rows);
}
