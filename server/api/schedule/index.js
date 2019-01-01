import * as auth from '../../auth/auth.service';
import * as controller from './schedule.controller';
import asyncWrapper from '../../middleware/async-wrapper'; // only wrap async functions

const router = require('express').Router();

router.get('/', asyncWrapper(controller.index));
router.put('/:id', auth.hasRole('admin'), asyncWrapper(controller.upsert)); // admin, update existing schedule item
router.delete('/:id', auth.hasRole('admin'), asyncWrapper(controller.destroy)); // admin, delete schedule item

module.exports = router;
