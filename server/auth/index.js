'use strict';
const express = require('express');
const router = express.Router();
const config = require('../config/environment');
import { User } from '../sqldb';

// Local passport configuration
require('./local/passport').setup(User, config);
router.use('/local', require('./local').default);

// Google passport configuration
require('./google/passport').setup(User, config);
router.use('/google', require('./google').default);

// Facebook passport configuration
// require('./facebook/passport').setup(User, config);
// router.use('/facebook', require('./facebook').default);

// Twitter passport configuration
// require('./twitter/passport').setup(User, config);
// router.use('/twitter', require('./twitter').default);

export default router;
