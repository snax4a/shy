import { Router } from 'express';
import config from '../config/environment';
import { User } from '../sqldb';
import asyncWrapper from '../middleware/async-wrapper'; // only wrap async functions

const router = Router();

// Local passport configuration
require('./local/passport').setup(User, config);
router.use('/local', require('./local').default);

// Google passport configuration
require('./google/passport').setup(User, config);
router.use('/google', require('./google').default);

export default router;
