'use strict';

import {Router} from 'express';
import * as controller from './schedule.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', controller.index);
router.put('/:id', auth.hasRole('admin'), controller.upsert); // admin, update existing schedule item
router.delete('/:id', auth.hasRole('admin'), controller.destroy); // admin, delete schedule item

module.exports = router;
