'use strict';

import { User, Purchase } from '../../sqldb';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import email from '../../components/email';
import Sequelize from 'sequelize';

const sequelize = new Sequelize(config.sequelize.uri, config.sequelize.options);

// Passes JSON back so that UI fields can be flagged for validation issues
function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return err => {
    res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return err => {
    console.log(err);
    return res.status(statusCode).send(err);
  };
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
      "lastName",
      "firstName",
      email,
      "optOut",
      phone,
      role,
      provider,
      COALESCE(purchase.purchases, 0) - COALESCE(attendance.attendances, 0) AS balance
    FROM "Users" "user" LEFT OUTER JOIN
      (SELECT "Purchases"."UserId", SUM("Purchases".quantity) AS purchases FROM "Purchases" GROUP BY "Purchases"."UserId") purchase
      ON "user"._id = purchase."UserId"
      LEFT OUTER JOIN
        (SELECT "Attendances"."UserId", COUNT("Attendances"._id) AS attendances FROM "Attendances" GROUP BY "Attendances"."UserId") attendance
        ON "user"._id = attendance."UserId"
    WHERE "user"."firstName" ILIKE :searchString OR "user"."lastName" ILIKE :searchString OR "user"."email" ILIKE :searchString;`;
  sequelize.query(sql,
    { replacements: { searchString: `${req.query.filter}%` }, type: sequelize.QueryTypes.SELECT })
    .then(users => res.status(200).json(users))
    .catch(handleError(res));
}

// Gets an array containing the user's attendances and purchases with a running balance
export function history(req, res, next) {
  const sql = `
    SELECT history._id,
      history."UserId",
      history.type,
      history."when",
      history.what,
      history.quantity,
      sum(history.quantity) OVER (PARTITION BY history."UserId" ORDER BY history."when") AS balance
    FROM (SELECT "Attendances"._id,
            "Attendances"."UserId",
            'A'::text AS type,
            "Attendances".attended AS "when",
            ((((('Attended '::text || "Attendances"."classTitle"::text) || ' in '::text) || "Attendances".location::text) || ' ('::text) || "Attendances".teacher::text) || ')'::text AS what,
            '-1'::integer AS quantity
            FROM "Attendances"
            WHERE "Attendances"."UserId" = :UserId
          UNION
          SELECT "Purchases"._id,
              "Purchases"."UserId",
              'P'::text AS type,
              "Purchases"."createdAt" AS "when",
              'Purchased '::text || "Purchases".quantity::text || ' class pass ('::text || "Purchases".method::text || ') '::text || "Purchases".notes::text AS what,
              "Purchases".quantity
            FROM "Purchases"
            WHERE "Purchases"."UserId" = :UserId) history
    ORDER BY history."UserId", history."when" DESC;`;
  sequelize.query(sql,
    { replacements: { UserId: `${req.params.id}` }, type: sequelize.QueryTypes.SELECT })
    .then(historyItems => res.status(200).json(historyItems))
    .catch(err => next(err));
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
  return User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(userToUpdate => {
      if(!userToUpdate) throw new UserError('No user with that email address was found.', 'email');
      if(userToUpdate.provider !== 'local') throw new UserError('Please visit https://myaccount.google.com/security if you forgot your password.', 'email');
      const newPassword = crypto.randomBytes(8).toString('base64'); // new password
      userToUpdate.password = newPassword;
      const html = `Your new Schoolhouse Yoga website temporary password for ${userToUpdate.email} is <b>${newPassword}</b>.
        Please login and change it at <a href="https://www.schoolhouseyoga.com/profile">https://www.schoolhouseyoga.com/profile</a>.`;
      return userToUpdate.save()
        .then(user => {
          res.status(200).send('New password sent.');
          email({
            to: user.email,
            subject: 'Schoolhouse Yoga website login',
            html
          });
          return null;
        })
        .catch(validationError(res));
    })
    .catch(validationError(res, 404));
}

// Updates attributes for authenticated user (Profile page)
export function update(req, res) {
  return User.findById(req.user._id) // users can only update themselves (req.user vs. req.body.user)
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
  if(req.body.password) {
    if(req.body.password === req.body.passwordConfirm) {
      userToUpsert.setDataValue('password', req.body.password);
    } else throw new UserError('Passwords must match.', 'passwordConfirm');
  } else Reflect.deleteProperty(userToUpsert.dataValues, 'password');

  return userToUpsert.save()
    .then(user => res.status(200).json({ _id: user._id }))
    .catch(validationError(res));
}

// Add classes to a user account (teachers or admins)
export function addClasses(req, res) {
  Reflect.deleteProperty(req.body, '_id'); // Prevent user _id from being viewed as the purchase _id
  let purchaseToAdd = Purchase.build(req.body);
  return purchaseToAdd.save()
    .then(purchase => res.status(200).json({ _id: purchase._id }))
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
  res.redirect('/');
}
