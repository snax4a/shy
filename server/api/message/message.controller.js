'use strict';
import email from '../../components/email';
import { User } from '../../sqldb';

// Sends a message
export function send(req, res) {
  // Add them to the subscribers list if they didn't opt out
  User.upsert({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    optOut: req.body.optOut
  })
  .then(() => {
    console.log('Added user from contact form');
  });

  email({
    subject: 'Question/comment from website',
    text:
`Name: ${req.body.firstName} ${req.body.lastName}
Email: ${req.body.email}

Question/comment:
${req.body.question}

${(req.body.optOut ? 'Does not want to s' : 'S')}ubscribe to newsletter`,
    success: 'Thanks for submitting your question or comment. We will respond shortly.',
    failure: 'Error occurred submitting your question or comment. Please try again later.'
  }, res);
}
