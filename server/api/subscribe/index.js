'use strict';

import express from 'express';
const controller = require('./subscribe.controller');
const router = express.Router();
router.get('/', controller.index);

module.exports = router;
