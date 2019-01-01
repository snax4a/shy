import { Router } from 'express';
import * as controller from './token.controller';
import asyncWrapper from '../../middleware/async-wrapper'; // only wrap async functions

const router = Router();

router.get('/', asyncWrapper(controller.index));

export default router;
