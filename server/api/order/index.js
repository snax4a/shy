import { Router } from 'express';
import * as controller from './order.controller';
import asyncWrapper from '../../middleware/async-wrapper'; // only wrap async functions

const router = Router();

router.get('/', asyncWrapper(controller.find));
router.post('/', asyncWrapper(controller.create));

export default router;
