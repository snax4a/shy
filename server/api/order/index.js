'use strict';
const router = require('express').Router();
const controller = require('./order.controller');

router.post('/', controller.create);

module.exports = router;
