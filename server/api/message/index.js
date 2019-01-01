import { Router } from 'express';
import * as controller from './message.controller';
import asyncWrapper from '../../middleware/async-wrapper'; // only wrap async functions

const router = Router();

router.post('/', asyncWrapper(controller.send));

export default router;
