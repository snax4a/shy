/* globals describe, expect, test */
import router from './index';

describe('Product API Route Handlers:', () => {
  test('should have unchanged route handlers', () =>
    expect(router.stack).toMatchSnapshot()
  );
});
