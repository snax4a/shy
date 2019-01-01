import * as controller from './user.controller';
import * as auth from '../../auth/auth.service';
import asyncWrapper from '../../middleware/async-wrapper'; // only wrap async functions

const router = require('express').Router();

router.get('/', auth.hasRole('teacher'), asyncWrapper(controller.index)); // teacher, admin, get users
router.get('/me', auth.isAuthenticated(), asyncWrapper(controller.me)); // user, retrieve profile

router.post('/', asyncWrapper(controller.create)); // sign-up and login
router.post('/forgotpassword', asyncWrapper(controller.forgotPassword)); // gen new password and email

router.put('/:id', auth.isAuthenticated(), asyncWrapper(controller.update)); // user - update profile
router.put('/:id/admin', auth.hasRole('teacher'), asyncWrapper(controller.upsert)); // teacher/admin - update existing user

router.delete('/:id', auth.hasRole('admin'), asyncWrapper(controller.destroy)); // admin, delete user

module.exports = router;
