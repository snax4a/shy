'use strict';
const router = require('express').Router();
const controller = require('./message.controller');

router.post('/', controller.send);

module.exports = router;
