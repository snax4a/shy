'use strict';
import email from '../../components/email';
const config = require('../../config/environment');

// Subscribes to the newsletter
export function subscribe(req, res) {
  email({
    to: config.mail.transport.auth.user,
    subject: 'Subscriber from Workshops page',
    text: `Email: ${req.body.email}`,
    success: 'Thanks for subscribing to our newsletter.',
    failure: 'Error occurred subscribing you. Please try again later.'
  }, res);
}
