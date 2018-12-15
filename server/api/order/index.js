'use strict';
const router = require('express').Router();
const controller = require('./order.controller');
const asyncWrapper = require('../../middleware/async-wrapper'); // only wrap async functions

router.post('/', asyncWrapper(controller.create));

module.exports = router;
