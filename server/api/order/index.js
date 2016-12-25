'use strict';

import express from 'express';
//import create from './order.controller';
const controller = require('./order.controller');

const router = express.Router();

router.post('/', controller.create);

module.exports = router;
