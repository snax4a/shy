'use strict';
import email from '../../components/email';

// Sends a message
export function send(req, res) {
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
