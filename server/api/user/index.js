'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', auth.isAuthenticated(), controller.me);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.put('/:id/upsert', auth.hasRole('admin'), controller.upsert); // update existing user
router.put('/upsert', auth.hasRole('admin'), controller.upsert); // insert new user
router.get('/:id', auth.isAuthenticated(), controller.show);
router.post('/forgotpassword', controller.forgotPassword);
router.post('/', controller.create);

module.exports = router;
