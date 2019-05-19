import db from '../../utils/db';

export async function csv(req, res) {
  await db.toCsv(res, 'SELECT * FROM report_teachers_csv');
}

// Returns JSON based on querystring params
export async function index(req, res) {
  const reports = {
    top10classes: 'SELECT * FROM report_top_10_classes;',
    bottom10classes: 'SELECT * FROM report_poorly_attended_classes;',
    schoolspie: 'SELECT * FROM report_attendance_by_location;',
    top10students: 'SELECT * FROM report_top_10_students;',
    attendancelast18m: 'SELECT * FROM report_attendance_by_location_last18m;',
    revenuelast18m: 'SELECT * FROM report_revenue_last18m',
    attendeesnhpq: 'SELECT count FROM attendees_nh_pq;',
    teacherpay: 'SELECT * FROM report_teacher_reimbursement_lastm;',
    studentsWhoOwe: 'SELECT student, email, balance, last_attended, last_purchase from students_who_owe order by balance LIMIT 10;'
  };

  const reportName = req.query.name;

  if(!reports.hasOwnProperty(reportName)) throw new Error('That report does not exist.');

  const { rows } = await db.query(reports[reportName], []);
  return res.status(200).send(rows);
}
