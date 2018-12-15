'use strict';
const router = require('express').Router();
const auth = require('../../auth/auth.service');
const asyncWrapper = require('../../middleware/async-wrapper'); // only wrap async functions
const controller = require('./schedule.controller');

router.get('/', asyncWrapper(controller.index));
router.put('/:id', auth.hasRole('admin'), asyncWrapper(controller.upsert)); // admin, update existing schedule item
router.delete('/:id', auth.hasRole('admin'), asyncWrapper(controller.destroy)); // admin, delete schedule item

module.exports = router;
