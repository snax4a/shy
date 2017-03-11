'use strict';

import { User } from '../../sqldb';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';

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

class UserValidationError extends Error {
  constructor(message, path) {
    super(message);
    this.message = message;
    this.name = 'UserValidationError';
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
    attributes: [
      '_id',
      'firstName',
      'lastName',
      'email',
      'phone',
      'role',
      'provider',
      'optOut'
    ]
  })
    .then(users => res.status(200).json(users))
    .catch(handleError(res));
}

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

/**
 * Get a single user
 */
export function show(req, res, next) {
  var userId = req.params.id;

  return User.find({
    where: {
      _id: userId
    }
  })
    .then(user => {
      if(!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
      return user;
    })
    .catch(err => next(err));
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
 * Update user profile
 */
export function update(req, res) {
  return User.find({
    where: {
      _id: req.user._id // users can only update themselves
    }
  })
    .then(userToUpdate => {
      const password = String(req.body.password);
      const passwordNew = String(req.body.passwordNew);
      const passwordConfirm = String(req.body.passwordConfirm);
      if(!userToUpdate.authenticate(password)) throw new UserValidationError('Password is incorrect.', 'password');
      if(passwordNew !== 'undefined' && userToUpdate.provider === 'local') {
        if(passwordNew !== passwordConfirm) throw new UserValidationError('Passwords must match.', 'passwordNew');
        userToUpdate.password = passwordNew;
      } else Reflect.deleteProperty(userToUpdate.dataValues, 'password'); // no password change

      // Set relevant properties
      userToUpdate.firstName = String(req.body.firstName);
      userToUpdate.lastName = String(req.body.lastName);
      userToUpdate.phone = String(req.body.phone);
      userToUpdate.optOut = String(req.body.optOut);
      if(userToUpdate.provider === 'local') userToUpdate.email = String(req.body.email);

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
    } else throw new UserValidationError('Passwords must match.', 'passwordConfirm');
  } else Reflect.deleteProperty(userToUpsert.dataValues, 'password');

  return userToUpsert.save()
    .then(user => res.status(200).json({ _id: user._id }))
    .catch(validationError(res));
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

/**
 * Authentication callback
 */
export function authCallback(req, res) {
  res.redirect('/');
}
