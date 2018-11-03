'use strict';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Sequelize from 'sequelize';

import config from '../../config/environment';
import { User } from '../../sqldb';

const sequelize = new Sequelize(config.sequelize.uri, config.sequelize.options);

// Passes JSON back so that UI fields can be flagged for validation issues
function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return err => res.status(statusCode).json(err);
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return err => res.status(statusCode).send(err);
}

class UserError extends Error {
  constructor(message, path) {
    super(message);
    this.message = message;
    this.name = 'UserError';
    this.errors = [{message, path}];
    Error.captureStackTrace(this, this.constructor);
  }
}

// Gets list of users with balances using filter (teacher or admin-only)
export function index(req, res) {
  const sql = `
    SELECT _id,
      INITCAP("lastName"),
      INITCAP("firstName"),
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
    WHERE "user"."firstName" ILIKE :searchString OR "user"."lastName" ILIKE :searchString OR "user"."email" ILIKE :searchString
    ORDER BY "user"."lastName", "user"."firstName";`;
  return sequelize.query(sql,
    { replacements: { searchString: `${req.query.filter}%` }, type: sequelize.QueryTypes.SELECT })
    .then(users => res.status(200).json(users))
    .catch(handleError(res));
}

// Gets attributes for logged-in user
export function me(req, res, next) {
  let userId = req.user._id;

  return User.find({
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
  })
    .then(user => {
      if(!user) {
        return res.status(401).end();
      }
      return res.status(200).json(user);
    })
    .catch(err => next(err));
}

// Creates new user and logs them in
export function create(req, res) {
  let newUser = User.build(req.body);
  newUser.setDataValue('provider', 'local');
  newUser.setDataValue('role', 'student');
  return newUser.save()
    .then(user => {
      let token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresIn: 60 * 60 * 5
      });
      res.status(200).json({ token });
      return user;
    })
    .catch(validationError(res));
}

// Resets password for user and emails it to them (add security question in future)
export function forgotPassword(req, res) {
  // If a local user exists, generate and email a new random password
  let html;
  return User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(userToUpdate => {
      if(!userToUpdate) throw new UserError('No user with that email address was found.');
      if(userToUpdate.provider !== 'local') throw new UserError('Please visit https://myaccount.google.com/security if you forgot your password.', 'email');
      const newPassword = crypto.randomBytes(8).toString('base64'); // new password
      userToUpdate.password = newPassword;
      html = `Your new Schoolhouse Yoga website temporary password for ${userToUpdate.email} is <b>${newPassword}</b>.
        Please login and change it at <a href="https://www.schoolhouseyoga.com/profile">https://www.schoolhouseyoga.com/profile</a>.`;
      return userToUpdate.save();
    })
    .then(() => {
      const message = {
        to: req.body.email,
        subject: 'Schoolhouse Yoga website login',
        html
      };
      const DELAY = 0; // milliseconds
      // Send the email then let the user know it was sent
      setTimeout(() => config.mail.transporter.sendMail(message)
        .then(info => console.log(`New password emailed to ${info.envelope.to} ${info.messageId}`))
        .catch(error => console.log(`Email error occurred: ${error.message}`, error))
      , DELAY);
      return res.status(200).send('New password sent.');
    })
    .catch(error => {
      console.log(error.message, error);
      if(!res.headersSent) return res.status(404).json(error);
      return null;
    });
}

// Updates attributes for authenticated user (Profile page)
export function update(req, res) {
  return User.findByPk(req.user._id) // users can only update themselves (req.user vs. req.body.user)
    .then(userToUpdate => {
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

      // Update the user
      return userToUpdate.save()
        .then(user => res.status(200).json({ _id: user._id }))
        .catch(validationError(res));
    })
    .catch(validationError(res));
}

// Updates or creates user (teachers or admins)
export function upsert(req, res) {
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

  return userToUpsert.save()
    .then(user => res.status(200).json({ _id: user._id }))
    .catch(validationError(res));
}

// Deletes user (admin-only)
export function destroy(req, res) {
  return User.destroy({ where: { _id: req.params.id } })
    .then(() => res.status(204).end())
    .catch(handleError(res));
}

// Authentication callback
export function authCallback(req, res) {
  return res.redirect('/');
}

