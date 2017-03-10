'use strict';
import email from '../../components/email';
import { User } from '../../sqldb';

// Subscribes to the newsletter
export function subscribe(req, res) {
  // Upsert subscriber to database
  const promise = User.upsert({
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

  return promise;
}

// Upsert subscriber to opt out (unsubscribe)
export function unsubscribe(req, res) {
  return User.upsert({
    email: req.params.email,
    optOut: true
  })
  .then(() => {
    res.status(200).send(`Unsubscribed ${req.params.email} from the newsletter.`);
    return console.log(`Unsubscribed ${req.params.email} from the newsletter.`);
  });
}
