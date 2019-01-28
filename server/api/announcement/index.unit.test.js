/* global describe, test, jest, beforeEach, expect */
import * as controller from './announcement.controller';
import * as auth from '../../auth/auth.service';
import asyncWrapper from '../../middleware/async-wrapper'; // only wrap async functions
import router from './index';

jest.mock('./index');
// const mockPlaySoundFile = jest.fn();
// jest.mock('./sound-player', () => {
//   return jest.fn().mockImplementation(() => {
//     return {playSoundFile: mockPlaySoundFile};
//   });
// });
jest.mock('../../auth/auth.service');
jest.mock('../../middleware/async-wrapper');
jest.mock('./announcement.controller');
// Now all method calls to router return undefined
// Method calls are saved to
// theAutomaticMock.mock.instances[index].methodName.mock.calls

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  router.mockClear();
});

describe('Announcement API Router:', () =>
  test('GET / calls controller.index in asyncWrapper', done => {
    router.get('/', asyncWrapper(controller.index));
    const mockRouterInstance = router.mock.instances[0];
    console.log(mockRouterInstance);
    expect(router.get).toHaveBeenCalledTimes(1);
    done();
  })
);
