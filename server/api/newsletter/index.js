import { Router } from 'express';
import * as controller from './newsletter.controller';
import asyncWrapper from '../../middleware/async-wrapper'; // only wrap async functions

const router = Router();

router.post('/', asyncWrapper(controller.subscribe));
router.get('/unsubscribe/:email', asyncWrapper(controller.unsubscribe));

export default router;
