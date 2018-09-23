'use strict';
const router = require('express').Router();
const controller = require('./history.controller');
const auth = require('../../auth/auth.service');

router.get('/attendees', auth.hasRole('teacher'), controller.attendees); // teacher, get attendees
router.get('/:id', auth.hasRole('teacher'), controller.index); // teacher, get student's history
router.post('/', auth.hasRole('teacher'), controller.create); // teacher, add a purchase or attendance record
router.put('/:id', auth.hasRole('admin'), controller.update); // admin, update existing history item
router.delete('/:id', auth.hasRole('admin'), controller.destroy); // admin, delete history item

module.exports = router;
