'use strict';

import { User } from '../../sqldb';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';
import { hasRole } from '../../auth/auth.service';

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return err => res.status(statusCode).json(err);
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return err => res.status(statusCode).send(err);
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
 * Update user profile
 */
export function update(req, res) {
  console.log('IS ADMIN', hasRole('admin') ? 'TRUE' : 'FALSE');

  // Users can only update themselves (admins can do anything)
  const userId = hasRole('admin') ? req.body._id : req.user._id;

  return User.find({
    where: {
      _id: userId
    }
  })
    .then(user => {
      // If undefined, user has Google+ login or isn't changing password
      const newPass = String(req.body.newPassword);
      const confirmPass = String(req.body.confirmPassword);
      if(newPass !== 'undefined' && user.provider === 'local') {
        if(newPass !== confirmPass) throw new Error('Passwords must match.');
        const oldPass = String(req.body.oldPassword);
        if(user.authenticate(oldPass)) {
          user.password = newPass;
        } else return validationError(res, 403); // did not authenticate, bail out
      //} else throw new Error('Password was incorrect.');
      }

      // Set relevant properties
      user.firstName = String(req.body.firstName);
      user.lastName = String(req.body.lastName);
      user.phone = String(req.body.phone);
      user.optOut = String(req.body.optOut);
      if(user.provider === 'local') user.email = String(req.body.email);

      console.log('STAGED CHANGES', user);

      // Update the user
      return user.save()
        .then(() => {
          res.status(204).end();
        })
        .catch(validationError(res));
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
