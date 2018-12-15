'use strict';

const router = require('express').Router();
const controller = require('./announcement.controller');
const auth = require('../../auth/auth.service');
const asyncWrapper = require('../../middleware/async-wrapper'); // only wrap async functions

router.get('/', asyncWrapper(controller.index));
router.put('/:id', auth.hasRole('admin'), asyncWrapper(controller.upsert)); // admin, update existing announcement
router.delete('/:id', auth.hasRole('admin'), asyncWrapper(controller.destroy)); // admin, delete announcement

module.exports = router;
