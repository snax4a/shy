import * as controller from './announcement.controller';
import * as auth from '../../auth/auth.service';
import asyncWrapper from '../../middleware/async-wrapper'; // only wrap async functions

const router = require('express').Router();

router.get('/', asyncWrapper(controller.index));
router.put('/:id', auth.hasRole('admin'), asyncWrapper(controller.upsert)); // admin, update existing announcement
router.delete('/:id', auth.hasRole('admin'), asyncWrapper(controller.destroy)); // admin, delete announcement

module.exports = router;
