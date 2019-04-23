import { Router } from 'express';
import cors from 'cors';
import * as auth from '../../auth/auth.service';
import * as controller from './schedule.controller';
import asyncWrapper from '../../middleware/async-wrapper'; // only wrap async functions

const router = Router();

router.get('/', cors(), asyncWrapper(controller.index));
router.put('/:id', auth.hasRole('admin'), asyncWrapper(controller.upsert)); // admin, update existing schedule item
router.delete('/:id', auth.hasRole('admin'), asyncWrapper(controller.destroy)); // admin, delete schedule item

export default router;
