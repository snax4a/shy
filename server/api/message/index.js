import * as controller from './message.controller';
import asyncWrapper from '../../middleware/async-wrapper'; // only wrap async functions

const router = require('express').Router();

router.post('/', asyncWrapper(controller.send));

module.exports = router;
