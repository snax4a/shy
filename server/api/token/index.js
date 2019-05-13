import { Router } from 'express';
import cors from 'cors';
import * as controller from './token.controller';
import asyncWrapper from '../../middleware/async-wrapper'; // only wrap async functions

const router = Router();

router.get('/', cors(), asyncWrapper(controller.index));

export default router;
