'use strict';
const config = require('../../config/environment');
import nodemailer from 'nodemailer';

export default function email(message, res) {
  message.from = config.mail.transport.auth.user;
  const transporter = nodemailer.createTransport(config.mail.transport); // to send the emails
  transporter.sendMail(message, (error, info) => {
    transporter.close();
    if(error) {
      if(res) res.status(500).send(message.failure);
      return console.log(error, info);
    }
    console.log(`Email with subject "${message.subject}" sent to ${message.to}`);
    if(res) res.status(200).send(message.success);
  });
}
