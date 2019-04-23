import { Router } from 'express';
import cors from 'cors';
import * as controller from './class.controller';
import { hasRole } from '../../auth/auth.service';
import asyncWrapper from '../../middleware/async-wrapper'; // only wrap async functions

const router = Router();

router.get('/', cors(), asyncWrapper(controller.index));
router.get('/active', asyncWrapper(controller.activeClasses));
router.put('/:id', hasRole('admin'), asyncWrapper(controller.upsert)); // admin, update existing class
router.delete('/:id', hasRole('admin'), asyncWrapper(controller.destroy)); // admin, delete class

export default router;
