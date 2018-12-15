'use strict';
import config from '../../config/environment';
import { User } from '../../sqldb';

// Upserts user to newsletter list then emails admins
export async function subscribe(req, res) {
  await User.upsert({
    email: req.body.email,
    firstName: 'Student',
    optOut: false
  });

  // Send response before the email goes out
  res.status(200).send('Thanks for subscribing to our newsletter.');

  const message = {
    to: config.mail.admins,
    subject: 'Subscriber from Workshops page',
    text: `Email: ${req.body.email}`
  };

  await config.mail.transporter.sendMail(message);
}

// Upsert subscriber to opt out (unsubscribe)
export async function unsubscribe(req, res) {
  await User.upsert({
    email: req.params.email,
    optOut: true
  });

  res.status(200).send(`Unsubscribed ${req.params.email} from the newsletter.`);
}
