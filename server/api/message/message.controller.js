import config from '../../config/environment';
import db from '../../db';

// Upsert user (including optOut attribute) to newsletter list then emails admins
export async function send(req, res) {
  // Send response before the email goes out
  res.status(200).send('Thanks for submitting your question or comment. We will respond shortly.');

  const { email, firstName, lastName, phone, optOut, question } = req.body;
  const userUpsertSQL = `INSERT INTO "Users"
  (email, "firstName", "lastName", phone, "optOut")
  VALUES ($1, $2, $3, $4, $5)
  ON CONFLICT (email) DO UPDATE
     SET "firstName" = $2, "lastName" = $3, phone = $4, "optOut" = $5;`;

  const message = {
    to: config.mail.admins,
    subject: 'Question/comment from website',
    text: `Name: ${firstName} ${lastName}
Email: ${email}

Question/comment:
${question}

${(optOut ? 'Does not want to s' : 'S')}ubscribe to newsletter`
  };

  await Promise.all([db.query(userUpsertSQL, [email, firstName, lastName, phone, optOut]), config.mail.transporter.sendMail(message)]);
}
