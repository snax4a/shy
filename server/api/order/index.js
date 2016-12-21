'use strict';

import express from 'express';
import create from './order.controller';

const router = express.Router();

router.post('/', create);

module.exports = router;
