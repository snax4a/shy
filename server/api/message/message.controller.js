'use strict';
import config from '../../config/environment';
import { User } from '../../sqldb';

// Upsert user (including optOut attribute) to newsletter list then emails admins
export function send(req, res) {
  return User.upsert(req.body)
    .then(wasInserted => {
      console.log(`User ${wasInserted ? 'Inserted' : 'Updated'}`);
      const message = {
        to: config.mail.admins,
        subject: 'Question/comment from website',
        text: `Name: ${req.body.firstName} ${req.body.lastName}
Email: ${req.body.email}

Question/comment:
${req.body.question}

${(req.body.optOut ? 'Does not want to s' : 'S')}ubscribe to newsletter`
      };
      return config.mail.transporter.sendMail(message);
    })
    .then(info => {
      console.log(`Emailed question or comment to admins ${info.messageId}`);
      return res.status(200).send('Thanks for submitting your question or comment. We will respond shortly.');
    })
    .catch(error => {
      console.log(`Email error occurred: ${error.message}`);
      return res.status(500).send('Error occurred submitting your question or comment. Please try again later.');
    });
}
