import * as controller from './order.controller';
import asyncWrapper from '../../middleware/async-wrapper'; // only wrap async functions

const router = require('express').Router();

router.post('/', asyncWrapper(controller.create));

module.exports = router;
