import { Router } from 'express';
import config from '../config/environment';
import { setup as localSetup } from './local/passport';
import local from './local';
import { setup as googleSetup } from './google/passport';
import google from './google';

import { User } from '../sqldb';
//import asyncWrapper from '../middleware/async-wrapper'; // only wrap async functions

const router = Router();

// Local passport configuration
localSetup(User, config);
router.use('/local', local);

// Google passport configuration
googleSetup(User, config);
router.use('/google', google);

export default router;
