'use strict';

import { User } from '../../sqldb';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import email from '../../components/email';

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return err => {
    res.status(statusCode).json(err);
  };
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

/**
 * Get list of users
 * restriction: 'admin'
 */
export function index(req, res) {
  let startsWith = `${req.query.filter}%`;
  return User.findAll({
    where: {
      $or: [
        { firstName: { $iLike: startsWith } },
        { lastName: { $iLike: startsWith } },
        { email: { $iLike: startsWith } }
      ]
    },
    //attributes: { exclude: ['$$hashKey', 'passwordHash', 'google', 'createdAt', 'updatedAt', 'profile', 'token'] }
    attributes: ['_id', 'firstName', 'lastName', 'email', 'optOut', 'phone', 'role', 'provider']
  })
    .then(users => res.status(200).json(users))
    .catch(handleError(res));
}

/**
 * Get my info
 */
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

// Commented out because this appears to be dead statusCode
/**
 * Get a single user
 */
// export function show(req, res, next) {
//   var userId = req.params.id;

//   return User.find({
//     where: {
//       _id: userId
//     }
//   })
//     .then(user => {
//       if(!user) {
//         return res.status(404).end();
//       }
//       res.json(user.profile);
//       return user;
//     })
//     .catch(err => next(err));
// }

/**
 * Creates a new user
 */
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

// Forgot password
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

/**
 * Update user profile
 */
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

      // Update the user
      return userToUpdate.save()
        .then(user => res.status(200).json({ _id: user._id }))
        .catch(validationError(res));
    })
    .catch(validationError(res));
}

/**
 * Update user (or insert if new), return _id
 * restriction: 'admin'
 */
export function upsert(req, res) {
  console.log('UPSERT');
  console.log('req.body', req.body);
  console.log('req.user', req.user);

  // New users are flagged with _id of zero, strip it before User.build
  if(req.body._id == 0) Reflect.deleteProperty(req.body, '_id');
  console.log('req.body after stripping', req.body);

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

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.destroy({ where: { _id: req.params.id } })
    .then(() => res.status(204).end())
    .catch(handleError(res));
}

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}
