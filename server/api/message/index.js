'use strict';
const router = require('express').Router();
const controller = require('./message.controller');
const asyncWrapper = require('../../middleware/async-wrapper'); // only wrap async functions

router.post('/', asyncWrapper(controller.send));

module.exports = router;
