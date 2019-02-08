import { Router } from 'express';
import * as controller from './product.controller';
import { hasRole } from '../../auth/auth.service';
import asyncWrapper from '../../middleware/async-wrapper'; // only wrap async functions

const router = Router();

router.get('/', asyncWrapper(controller.index));
router.get('/active', asyncWrapper(controller.activeProducts));
router.put('/:id', hasRole('admin'), asyncWrapper(controller.upsert)); // admin, update existing product
router.delete('/:id', hasRole('admin'), asyncWrapper(controller.destroy)); // admin, delete product

export default router;
