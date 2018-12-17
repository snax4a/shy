'use strict';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
const db = require('../../db');

import config from '../../config/environment';
import { User } from '../../sqldb';

class UserError extends Error {
  constructor(message, path) {
    super(message);
    this.message = message;
    this.name = 'UserError';
    this.errors = [{message, path}];
    Error.captureStackTrace(this, this.constructor);
  }
}

function userMissingError() {
  let thisError = new UserError('No user with that email address was found.', 'email');
  thisError.status = 404;
  throw thisError;
}

// Gets list of users with balances using filter (teacher or admin-only)
export async function index(req, res) {
  const sql = `
    SELECT _id,
      INITCAP("lastName") AS "lastName",
      INITCAP("firstName") AS "firstName",
      email,
      "optOut",
      phone,
      role,
      provider,
      (COALESCE(purchase.purchases, 0) - COALESCE(attendance.attendances, 0))::int AS balance
    FROM "Users" "user" LEFT OUTER JOIN
      (SELECT "Purchases"."UserId", SUM("Purchases".quantity) AS purchases FROM "Purchases" GROUP BY "Purchases"."UserId") purchase
      ON "user"._id = purchase."UserId"
      LEFT OUTER JOIN
        (SELECT "Attendances"."UserId", COUNT("Attendances"._id) AS attendances FROM "Attendances" GROUP BY "Attendances"."UserId") attendance
        ON "user"._id = attendance."UserId"
    WHERE "user"."firstName" ILIKE $1 || '%' OR "user"."lastName" ILIKE $1 || '%' OR "user"."email" ILIKE $1 || '%'
    ORDER BY "user"."lastName", "user"."firstName";`;
  const { rows } = await db.query(sql, [req.query.filter]);
  res.status(200).send(rows);
}

// Gets attributes for logged-in user
export async function me(req, res) {
  let userId = req.user._id;
  const user = await User.findOne({
    where: {
      _id: userId
    },
    attributes: [
      '_id',
      'firstName',
      'lastName',
      'email',
      'role',
      'phone',
      'optOut',
      'provider'
    ]
  });
  if(!user) userMissingError();
  res.status(200).send(user);
}

// Creates new user and logs them in
export async function create(req, res) {
  let newUser = User.build(req.body);
  newUser.setDataValue('provider', 'local');
  newUser.setDataValue('role', 'student');
  const user = await newUser.save();
  let token = jwt.sign({ _id: user._id }, config.secrets.session, {
    expiresIn: 60 * 60 * 5
  });
  res.status(200).send({ token });
}

// Resets password for user and emails it to them (add security question in future)
export async function forgotPassword(req, res) {
  // If a local user exists, generate and email a new random password
  let html;
  const userToUpdate = await User.findOne({
    where: {
      email: req.body.email
    }
  });

  // Conditions for throwing errors

  // User not found (404)
  if(!userToUpdate) userMissingError();

  // If a Google-integrated login, user must reset their password on Google - not here.
  if(userToUpdate.provider !== 'local') {
    let googleError = new UserError('Please visit https://myaccount.google.com/security if you forgot your password.', 'email');
    googleError.status = 403;
    console.log('googleError', googleError);
    throw googleError;
  }

  // Generate a new random password and save it
  const newPassword = crypto.randomBytes(8).toString('base64'); // new password
  userToUpdate.password = newPassword;
  html = `Your new Schoolhouse Yoga website temporary password for ${userToUpdate.email} is <b>${newPassword}</b>.
  Please login and change it at <a href="https://www.schoolhouseyoga.com/profile">https://www.schoolhouseyoga.com/profile</a>.`;
  await userToUpdate.save();

  // Generate email
  const message = {
    to: req.body.email,
    subject: 'Schoolhouse Yoga website login',
    html
  };
  await config.mail.transporter.sendMail(message);

  // Tell the user the new password was sent (if we do this before sendMail, we'll need to check headers in our central error handler)
  res.status(200).send('New password sent.');
}

// Updates attributes for authenticated user (Profile page)
export async function update(req, res) {
  const userToUpdate = await User.findByPk(req.user._id); // users can only update themselves (req.user vs. req.body.user)

  // Only authenticate and handle password or email changes for local accounts
  if(userToUpdate.provider === 'local') {
    // Check password
    const password = String(req.body.password);
    if(!userToUpdate.authenticate(password)) throw new UserError('Password is incorrect.', 'password');

    // Check for a password change
    const passwordNew = String(req.body.passwordNew);
    if(passwordNew !== 'undefined') {
      const passwordConfirm = String(req.body.passwordConfirm);
      if(passwordNew !== passwordConfirm) throw new UserError('Passwords must match.', 'passwordNew');
      userToUpdate.password = passwordNew;
    }

    // If nothing failed so far, handle email change
    userToUpdate.email = String(req.body.email);
  } else Reflect.deleteProperty(userToUpdate.dataValues, 'password'); // no password change

  // Set relevant properties
  userToUpdate.firstName = String(req.body.firstName);
  userToUpdate.lastName = String(req.body.lastName);
  userToUpdate.phone = String(req.body.phone);
  userToUpdate.optOut = req.body.optOut;

  // Prevent hacking the role
  Reflect.deleteProperty(userToUpdate.dataValues, 'role');
  const user = await userToUpdate.save();
  res.status(200).send({ _id: user._id });
}

// Updates or creates user (teachers or admins)
export async function upsert(req, res) {
  // New users are flagged with _id of zero, strip it before User.build
  if(req.body._id === 0) Reflect.deleteProperty(req.body, '_id');

  let userToUpsert = User.build(req.body);

  // Detect new users and set defaults appropriately
  if(!req.body._id) {
    userToUpsert.setDataValue('provider', req.body.provider || 'local');
    userToUpsert.setDataValue('role', req.body.role || 'student');
  } else userToUpsert.isNewRecord = false;

  // Determine whether password is to be updated or not
  if(req.body.password && req.body.passwordConfirm) {
    if(req.body.password === req.body.passwordConfirm) {
      userToUpsert.setDataValue('password', req.body.password);
    } else throw new UserError('Passwords must match.', 'passwordConfirm');
  } else Reflect.deleteProperty(userToUpsert.dataValues, 'password');

  const user = await userToUpsert.save();
  res.status(200).send({ _id: user._id });
}

// Deletes user (admin-only)
export async function destroy(req, res) {
  await User.destroy({ where: { _id: req.params.id } });
  res.status(204).end();
}

// Authentication callback - is it needed?
// export function authCallback(req, res) {
//   return res.redirect('/');
// }
