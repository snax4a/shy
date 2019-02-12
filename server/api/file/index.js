import { Router } from 'express';
import * as controller from './file.controller';
import { hasRole } from '../../auth/auth.service';
import asyncWrapper from '../../middleware/async-wrapper'; // only wrap async functions

const router = Router();

router.get('/', asyncWrapper(controller.index));
router.get('/:id', asyncWrapper(controller.download));
router.post('/upload', hasRole('admin'), asyncWrapper(controller.upload)); // admin, upload file
router.delete('/:id', hasRole('admin'), asyncWrapper(controller.destroy)); // admin, delete file

export default router;
