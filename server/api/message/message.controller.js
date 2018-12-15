'use strict';
import config from '../../config/environment';
import { User } from '../../sqldb';

// Upsert user (including optOut attribute) to newsletter list then emails admins
export async function send(req, res) {
  await User.upsert(req.body);

  // Send response before the email goes out
  res.status(200).send('Thanks for submitting your question or comment. We will respond shortly.');

  const message = {
    to: config.mail.admins,
    subject: 'Question/comment from website',
    text: `Name: ${req.body.firstName} ${req.body.lastName}
Email: ${req.body.email}

Question/comment:
${req.body.question}

${(req.body.optOut ? 'Does not want to s' : 'S')}ubscribe to newsletter`
  };

  await config.mail.transporter.sendMail(message);
}
