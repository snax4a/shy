'use strict';

var express = require('express');
var controller = require('./order.controller');

var router = express.Router();

router.post('/place', controller.placeOrder);

module.exports = router;
