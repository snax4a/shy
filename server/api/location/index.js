import { Router } from 'express';
import * as controller from './location.controller';
import { hasRole } from '../../auth/auth.service';
import asyncWrapper from '../../middleware/async-wrapper'; // only wrap async functions

const router = Router();

router.get('/', asyncWrapper(controller.index));
router.get('/active', asyncWrapper(controller.activeLocations));
router.put('/:id', hasRole('admin'), asyncWrapper(controller.upsert)); // admin, update existing location
router.delete('/:id', hasRole('admin'), asyncWrapper(controller.destroy)); // admin, delete location

export default router;
