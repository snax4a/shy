'use strict';
import config from '../../config/environment';
import { User } from '../../sqldb';

// Upserts user to newsletter list then emails admins
export function subscribe(req, res) {
  return User.upsert({
    email: req.body.email,
    firstName: 'Student',
    optOut: false
  })
    .then(() => {
      const message = {
        to: config.mail.admins,
        subject: 'Subscriber from Workshops page',
        text: `Email: ${req.body.email}`
      };
      return config.mail.transporter.sendMail(message);
    })
    .then(info => {
      console.log(`Emailed newsletter subscription to admins ${info.messageId}`);
      return res.status(200).send('Thanks for subscribing to our newsletter.');
    })
    .catch(error => {
      console.log(`Email error occurred: ${error.message}`);
      return res.status(500).json(error);
    });
}

// Upsert subscriber to opt out (unsubscribe)
export function unsubscribe(req, res) {
  return User.upsert({
    email: req.params.email,
    optOut: true
  })
    .then(() => res.status(200).send(`Unsubscribed ${req.params.email} from the newsletter.`))
    .catch(error => res.status(422).json(error));
}
