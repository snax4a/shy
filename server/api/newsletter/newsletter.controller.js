'use strict';
import email from '../../components/email';
import { Subscriber } from '../../sqldb';

// Subscribes to the newsletter
export function subscribe(req, res) {
  // Save subscriber to databse
  Subscriber.upsert({
    email: req.body.email,
    optout: false
  })
  .then(() => {
    console.log('Added subscriber from workshops page');
  });

  // Send email to SHY staff
  email({
    subject: 'Subscriber from Workshops page',
    text: `Email: ${req.body.email}`,
    success: 'Thanks for subscribing to our newsletter.',
    failure: 'Error occurred subscribing you. Please try again later.'
  }, res);
}
