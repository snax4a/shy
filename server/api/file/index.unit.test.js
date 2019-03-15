/* globals describe, expect, test */
import router from './index';

describe('File API Route Handlers:', () => {
  test('should have unchanged route handlers', () =>
    expect(router.stack).toMatchSnapshot()
  );
});
