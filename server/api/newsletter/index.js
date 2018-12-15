'use strict';
const router = require('express').Router();
const controller = require('./newsletter.controller');
const asyncWrapper = require('../../middleware/async-wrapper'); // only wrap async functions

router.post('/', asyncWrapper(controller.subscribe));
router.get('/unsubscribe/:email', asyncWrapper(controller.unsubscribe));

module.exports = router;
