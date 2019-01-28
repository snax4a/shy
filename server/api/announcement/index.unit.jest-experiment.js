/* global test, jest, expect */
//import express from 'express';
import * as controller from './announcement.controller';
import { hasRole } from '../../auth/auth.service';
import asyncWrapper from '../../middleware/async-wrapper'; // only wrap async functions
//import router from './index';

jest.mock('../../middleware/async-wrapper', fn => `asyncWrapper.${fn}`);
jest.mock('../../auth/auth.service', role => `hasRole.${role}`);
const controllerStub = {
  upsert: 'controller.upsert'
};
jest.mock('./announcement.controller', controller => {
  return {
    upsert: 'controller.upsert'
  }
});
//jest.mock('express');

jest.mock('./index');

test('should route to controller.index', () => {
  //const router = express.Router();
  console.log(hasRole('admin'));

  expect(hasRole('admin').mock.calls).toHaveLength(1);
  //console.log(router.get('/', asyncWrapper(controller.index)));
});

// test('should call controller.index wrapped in asyncWrapper for router.get(\'/\')', () => {
//   expect(router.get.mock.calls).toHaveLength(1);
//   expect(router.put.mock.calls[0][0]).toBe('Hello World!');
// });
