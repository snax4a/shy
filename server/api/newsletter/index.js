'use strict';

var express = require('express');
var controller = require('./newsletter.controller');

var router = express.Router();

router.post('/subscribe', controller.subscribe);

module.exports = router;
