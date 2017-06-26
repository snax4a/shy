'use strict';
const router = require('express').Router();
const controller = require('./token.controller');

router.get('/', controller.index);

module.exports = router;
