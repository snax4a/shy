'use strict';
import email from '../../components/email';
import { Subscriber } from '../../sqldb';

// Sends a message
export function send(req, res) {
  // Add them to the subscribers list if they didn't opt out
  if(!req.body.optout) {
    Subscriber.upsert({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName
    })
    .then(() => {
      console.log('Added subscriber from contact form');
    });
  }

  email({
    subject: 'Question/comment from website',
    text:
`Name: ${req.body.firstName} ${req.body.lastName}
Email: ${req.body.email}

Question/comment:
${req.body.question}

${(req.body.optout ? 'Does not want to s' : 'S')}ubscribe to newsletter`,
    success: 'Thanks for submitting your question or comment. We will respond shortly.',
    failure: 'Error occurred submitting your question or comment. Please try again later.'
  }, res);
}
