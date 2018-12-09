'use strict';
const router = require('express').Router();
const controller = require('./announcement.controller');
const auth = require('../../auth/auth.service');
const asyncMiddleware = require('../../middleware/async-middleware'); // only wrap async functions

router.get('/', asyncMiddleware(controller.index));
router.put('/:id', auth.hasRole('admin'), asyncMiddleware(controller.upsert)); // admin, update existing announcement
router.delete('/:id', auth.hasRole('admin'), asyncMiddleware(controller.destroy)); // admin, delete announcement

module.exports = router;
