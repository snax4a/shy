/* globals describe, expect, test */
import router from './index';

describe('History API Route Handlers:', () =>
  test('should have unchanged route handlers', () =>
    expect(router.stack).toMatchSnapshot()
  )
);
