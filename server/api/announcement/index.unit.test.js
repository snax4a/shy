/* global test, jest, expect */
import router from './index';
import asyncWrapper from '../../middleware/async-wrapper';

test('should call controller.index wrapped in asyncWrapper for router.get(\'/\')', () => {
  const router = {
    get: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  };
  expect(router.get.mock.calls).toHaveLength(1);
  expect(router.put.mock.calls[0][0]).toBe('Hello World!');
});
