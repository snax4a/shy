'use strict';
const express = require('express');
const controller = require('./announcement.controller');
const router = express.Router();
const auth = require('../../auth/auth.service');

router.get('/', controller.index);
router.put('/:id', auth.hasRole('admin'), controller.upsert); // admin, update existing announcement
router.delete('/:id', auth.hasRole('admin'), controller.destroy); // admin, delete announcement

module.exports = router;
