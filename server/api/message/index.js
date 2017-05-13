'use strict';
const express = require('express');
const controller = require('./message.controller');
const router = express.Router();

router.post('/', controller.send);

module.exports = router;
