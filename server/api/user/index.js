'use strict';
const express = require('express');
const controller = require('./user.controller');
const router = express.Router();
const auth = require('../../auth/auth.service');

router.get('/', auth.hasRole('teacher'), controller.index); // teacher, admin, get users
router.get('/me', auth.isAuthenticated(), controller.me); // user, retrieve profile

router.post('/', controller.create); // sign-up and login
router.post('/forgotpassword', controller.forgotPassword); // gen new password and email

router.put('/:id', auth.isAuthenticated(), controller.update); // user, update profile
router.put('/:id/admin', auth.hasRole('teacher'), controller.upsert); // teacher, admin, update existing user
router.put('/:id/classes', auth.hasRole('teacher'), controller.addClasses); // teacher, admin, add classes to user

router.delete('/:id', auth.hasRole('admin'), controller.destroy); // admin, delete user

module.exports = router;
