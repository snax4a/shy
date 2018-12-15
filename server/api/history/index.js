'use strict';

const router = require('express').Router();
const controller = require('./history.controller');
const auth = require('../../auth/auth.service');
const asyncWrapper = require('../../middleware/async-wrapper'); // only wrap async functions

router.get('/attendees', auth.hasRole('teacher'), asyncWrapper(controller.attendees)); // teacher, get attendees
router.get('/:id', auth.hasRole('teacher'), asyncWrapper(controller.index)); // teacher, get student's history
router.post('/', auth.hasRole('teacher'), asyncWrapper(controller.create)); // teacher, add a purchase or attendance record
router.put('/:id', auth.hasRole('admin'), asyncWrapper(controller.update)); // admin, update existing history item
router.delete('/:id', auth.hasRole('teacher'), asyncWrapper(controller.destroy)); // admin, delete history item

module.exports = router;
