'use strict';
import { Router } from 'express-promise-router';
import * as controller from './announcement.controller';
import * as auth from '../../auth/auth.service';
const router = new Router();

// async router example w/pg: https://node-postgres.com/guides/async-express
router.get('/', controller.index);
router.put('/:id', auth.hasRole('admin'), controller.upsert); // admin, update existing announcement
router.delete('/:id', auth.hasRole('admin'), controller.destroy); // admin, delete announcement

export default router;
