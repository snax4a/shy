'use strict';
const express = require('express');
const controller = require('./order.controller');

const router = express.Router();
router.post('/', controller.create);

module.exports = router;
