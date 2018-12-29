'use strict';
import config from '../../config/environment';
import db from '../../db';

// Upserts user to newsletter list then emails admins
export async function subscribe(req, res) {
  // Send response before database and email operations
  res.status(200).send('Thanks for subscribing to our newsletter.');

  const userUpsertSQL = `INSERT INTO "Users"
  (email, "firstName", "optOut", "createdAt", "updatedAt")
  VALUES ($1, 'Student', false, CURRENT_DATE, CURRENT_DATE)
  ON CONFLICT (email) DO UPDATE
     SET "optOut" = false, "updatedAt" = CURRENT_DATE;`;

  const message = {
    to: config.mail.admins,
    subject: 'Subscriber from Workshops page',
    text: `Email: ${req.body.email}`
  };

  await Promise.all([db.query(userUpsertSQL, [req.body.email]), config.mail.transporter.sendMail(message)]);
}

// Upsert subscriber to opt out (unsubscribe)
export async function unsubscribe(req, res) {
  // Send response before database and email operations
  res.status(200).send(`Unsubscribed ${req.params.email} from the newsletter.`);

  const unsubscribeSQL = `UPDATE "Users" SET "optOut" = true WHERE email = $1;`
  await db.query(unsubscribeSQL, [req.params.email]);
}
