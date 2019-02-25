import { Router } from 'express';
import * as controller from './report.controller';
import { hasRole } from '../../auth/auth.service';
import asyncWrapper from '../../middleware/async-wrapper'; // only wrap async functions

const router = Router();

router.get('/', hasRole('admin'), asyncWrapper(controller.index));

export default router;
