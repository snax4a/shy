'use strict';
import nodemailer from 'nodemailer';
const config = require('../../config/environment');
const transporter = nodemailer.createTransport(config.mail.transport); // to send the emails

const sendMail = message => {
  message.from = config.mail.transport.auth.user;
  transporter.sendMail(message, (error, info) => {
    if(error) {
      return console.log(error, info);
    } else {
      console.log(`Email with subject: ${message.subject}`);
    }
  });
};

// Subscribes to the newsletter
export function subscribe(req, res) {
  console.log(req);
  sendMail({
    to: config.mail.transport.auth.user,
    subject: 'Subscriber from Workshops page',
    html: `Name: ${req.contact.firstName} ${req.contact.lastName} (${req.contact.email})`
  });
  res.status(200).send('OK');
}
