/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/subscribe              ->  index
 */
'use strict';
import nodemailer from 'nodemailer';
import config from '../../config/environment';
const transporter = nodemailer.createTransport(config.mail.transport); // to send the emails

// Gets a list of Subscribes
export function index(req, res) {
  res.json([]);
}
