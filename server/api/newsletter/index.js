'use strict';
const router = require('express').Router();
const controller = require('./newsletter.controller');

router.post('/', controller.subscribe);
router.get('/unsubscribe/:email', controller.unsubscribe);

module.exports = router;
