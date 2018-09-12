'use strict';
const router = require('express').Router();
const controller = require('./user.controller');
const auth = require('../../auth/auth.service');

router.get('/', auth.hasRole('teacher'), controller.index); // teacher, admin, get users
router.get('/me', auth.isAuthenticated(), controller.me); // user, retrieve profile
router.get('/:id/history', auth.hasRole('teacher'), controller.history); // teacher/admin - get user history

router.post('/', controller.create); // sign-up and login
router.post('/forgotpassword', controller.forgotPassword); // gen new password and email

router.put('/:id', auth.isAuthenticated(), controller.update); // user - update profile
router.put('/:id/admin', auth.hasRole('teacher'), controller.upsert); // teacher/admin - update existing user
router.put('/:id/classes', auth.hasRole('teacher'), controller.classAdd); // teacher/admin - add classes to user
router.put('/:id/attendance', auth.hasRole('teacher'), controller.attendanceAdd); // teacher/admin - add attendance
router.put('/:id/history', auth.hasRole('admin'), controller.historyItemUpdate); // admin, update history item

router.delete('/:id', auth.hasRole('admin'), controller.destroy); // admin, delete user
router.delete('/:id/history', auth.hasRole('admin'), controller.historyItemDelete); // admin, delete history item
router.delete('/:id/attendance', auth.hasRole('teacher'), controller.attendanceDelete); // teacher/admin, delete attendance item

module.exports = router;
