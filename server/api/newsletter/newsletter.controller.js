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
  sendMail({
    to: req.body.email,
    subject: 'Subscriber from Workshops page',
    html: req.body.firstName
  });
  res.status(200).send('OK');
}
