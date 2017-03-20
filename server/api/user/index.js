'use strict';

import {Router} from 'express';
import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';

var router = new Router();

router.get('/', auth.hasRole('admin'), controller.index); // admin, get users
router.get('/me', auth.isAuthenticated(), controller.me); // user, retrieve profile

router.post('/', controller.create); // sign-up and login
router.post('/forgotpassword', controller.forgotPassword); // gen new password and email

router.put('/:id', auth.isAuthenticated(), controller.update); // user, update profile
router.put('/:id/admin', auth.hasRole('admin'), controller.upsert); // admin, update existing user

router.delete('/:id', auth.hasRole('admin'), controller.destroy); // admin, delete user

module.exports = router;
