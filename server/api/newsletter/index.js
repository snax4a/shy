import * as controller from './newsletter.controller';
import asyncWrapper from '../../middleware/async-wrapper'; // only wrap async functions

const router = require('express').Router();

router.post('/', asyncWrapper(controller.subscribe));
router.get('/unsubscribe/:email', asyncWrapper(controller.unsubscribe));

module.exports = router;
