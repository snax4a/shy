'use strict';

const express = require('express');
const controller = require('./announcement.controller');
var router = express.Router();

router.get('/', controller.index);

module.exports = router;
