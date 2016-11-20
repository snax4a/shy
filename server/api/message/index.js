'use strict';

import express from 'express';
const controller = require('./message.controller');

const router = express.Router();

router.post('/send', controller.send);

module.exports = router;
