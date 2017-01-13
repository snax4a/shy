'use strict';
import email from '../../components/email';
import { User } from '../../sqldb';

// Subscribes to the newsletter
export function subscribe(req, res) {
  // Save subscriber to database
  User.upsert({
    email: req.body.email,
    firstName: 'Student',
    optOut: false
  })
  .then(() => console.log('Added user from workshops page to newsletter list.'));

  // Send email to SHY staff
  email({
    subject: 'Subscriber from Workshops page',
    text: `Email: ${req.body.email}`,
    success: 'Thanks for subscribing to our newsletter.',
    failure: 'Error occurred subscribing you. Please try again later.'
  }, res);
}

// Sets the subscriber to opt out
export function unsubscribe(req, res) {
  User.upsert({
    email: req.params.email,
    optOut: true
  })
  .then(() => {
    res.status(200).send(`Unsubscribed ${req.params.email} from the newsletter.`);
    console.log(`Unsubscribed ${req.params.email} from the newsletter.`);
  });
}
