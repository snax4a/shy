'use strict';
const Router = require('express-promise-router');
const controller = require('./announcement2.controller');
const auth = require('../../auth/auth.service');
const router = new Router();

router.get('/', controller.index);
router.put('/:id', auth.hasRole('admin'), controller.upsert); // admin, update existing announcement
router.delete('/:id', auth.hasRole('admin'), controller.destroy); // admin, delete announcement

module.exports = router;
