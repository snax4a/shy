'use strict';

import {Router} from 'express';
import * as controller from './announcement.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', controller.index);
router.delete('/:id', controller.destroy); // admin, delete announcement
router.put('/:id', controller.upsert); // admin, update existing announcement

//router.put('/:id', auth.hasRole('admin'), controller.upsert); // admin, update existing announcement
//router.delete('/:id', auth.hasRole('admin'), controller.destroy); // admin, delete announcement

module.exports = router;
