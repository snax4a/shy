'use strict';
const router = require('express').Router();
const controller = require('./token.controller');
const asyncWrapper = require('../../middleware/async-wrapper'); // only wrap async functions

router.get('/', asyncWrapper(controller.index));

module.exports = router;
