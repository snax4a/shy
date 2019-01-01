import * as controller from './token.controller';
import asyncWrapper from '../../middleware/async-wrapper'; // only wrap async functions

const router = require('express').Router();

router.get('/', asyncWrapper(controller.index));

module.exports = router;
