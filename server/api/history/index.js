import { Router } from 'express';
import * as controller from './history.controller';
import * as auth from '../../auth/auth.service';
import asyncWrapper from '../../middleware/async-wrapper'; // only wrap async functions

const router = Router();

router.get('/attendees', auth.hasRole('teacher'), asyncWrapper(controller.attendees)); // teacher, get attendees
router.get('/:id', auth.hasRole('teacher'), asyncWrapper(controller.index)); // teacher, get student's history
router.post('/', auth.hasRole('teacher'), asyncWrapper(controller.create)); // teacher, add a purchase or attendance record
router.put('/:id', auth.hasRole('admin'), asyncWrapper(controller.update)); // admin, update existing history item
router.delete('/:id', auth.hasRole('teacher'), asyncWrapper(controller.destroy)); // admin, delete history item

export default router;
