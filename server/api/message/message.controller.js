import config from '../../config/environment';
import { contactUpsert } from '../user/user.controller';

// Upsert user (including optOut attribute) to newsletter list then emails admins
export async function send(req, res) {
  // Send response before the email goes out
  res.status(200).send('Thanks for submitting your question or comment. We will respond shortly.');

  const { email, firstName, lastName, optOut, question } = req.body;

  const message = {
    to: config.mail.admins,
    subject: 'Question/comment from website',
    text: `Name: ${firstName} ${lastName}
Email: ${email}

Question/comment:
${question}

${(optOut ? 'Does not want to s' : 'S')}ubscribe to newsletter`
  };

  await Promise.all([
    contactUpsert(req.body, true),
    config.mail.transporter.sendMail(message)
  ]);
}
