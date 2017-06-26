'use strict';
const router = require('express').Router();
const controller = require('./announcement.controller');
const auth = require('../../auth/auth.service');

router.get('/', controller.index);
router.put('/:id', auth.hasRole('admin'), controller.upsert); // admin, update existing announcement
router.delete('/:id', auth.hasRole('admin'), controller.destroy); // admin, delete announcement

module.exports = router;
