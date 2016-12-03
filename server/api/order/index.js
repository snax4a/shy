'use strict';

import express from 'express';
const controller = require('./order.controller');

const router = express.Router();

router.post('/', controller.create);

module.exports = router;
