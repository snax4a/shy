'use strict';
const config = require('../../config/environment');
import nodemailer from 'nodemailer';

export default function email(message, res) {
  // If recipient specified, BCC the sender (such as orders), else it's internal
  message.bcc = 'jen@schoolhouseyoga.com,monique@schoolhouseyoga.com';
  if(message.to) {
    message.bcc = `${message.bcc},${config.mail.bcc}`;
  } else message.to = config.mail.transport.auth.user;

  message.from = config.mail.transport.auth.user;
  //message.attachments = [{ cid: 'seal.jpg', filename: 'seal.jpg', path: 'https://www.schoolhouseyoga.com/assets/images/seal.jpg'}];
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
