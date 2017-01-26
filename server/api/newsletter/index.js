'use strict';

import express from 'express';

const controller = require('./newsletter.controller');
const router = express.Router();

router.post('/', controller.subscribe);
router.get('/unsubscribe/:email', controller.unsubscribe);

module.exports = router;
