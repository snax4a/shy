'use strict';
import nodemailer from 'nodemailer';
const config = require('../../config/environment');

const sendMail = message => {
  message.from = config.mail.transport.auth.user;
  const transporter = nodemailer.createTransport(config.mail.transport); // to send the emails
  transporter.sendMail(message, (error, info) => {
    if(error) {
      return console.log(error, info);
    } else {
      console.log(`Email with subject: ${message.subject} sent`);
    }
  });
};

// Subscribes to the newsletter
export function subscribe(req, res) {
  sendMail({
    to: config.mail.transport.auth.user,
    subject: 'Subscriber from Workshops page',
    html: `Email: ${req.body.email}`
  });
  res.status(200).send('OK');
}
