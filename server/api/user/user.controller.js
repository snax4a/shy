'use strict';

import { User } from '../../sqldb';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return err => {
    console.log('user.controller.js error', err);
    return res.status(statusCode).json(err);
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    return res.status(statusCode).send(err);//should be err.message
  };
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
    .then(users => {
      res.status(200).json(users);
    })
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
    })
    .catch(err => next(err));
}

/**
 * Deletes a user
 * restriction: 'admin'
 */
export function destroy(req, res) {
  return User.destroy({ where: { _id: req.params.id } })
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
}

/**
 * Change a user's password
 */
export function changePassword(req, res) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  return User.find({
    where: {
      _id: userId
    }
  })
    .then(user => {
      if(user.authenticate(oldPass)) {
        user.password = newPass;
        return user.save()
          .then(() => {
            res.status(204).end();
          })
          .catch(validationError(res));
      } else {
        return res.status(403).end();
      }
    });
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
    } else throw new Error('Passwords must match.');
  } else Reflect.deleteProperty(userToUpsert.dataValues, 'password');

  console.log('userToUpsert', userToUpsert);
  return userToUpsert.save()
    // Instead of returning res.status, should I return userToUpsert (promise)?
    .then(user => res.status(200).json({ _id: user._id }))
    .catch(err => {
      res.status(500).send(err.message);
    });
}

/**
 * Get my info
 */
export function me(req, res, next) {
  var userId = req.user._id;

  return User.find({
    where: {
      _id: userId
    },
    attributes: [
      '_id',
      'firstName',
      'lastName',
      'email',
      'role'
//      'phone',
//      'provider',
//      'optOut'
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
