/* global describe, before, it */

import app from '../..';
import request from 'supertest';

describe('Token API:', function() {
  describe('GET /api/token', function() {
    let token;

    before(() =>
      request(app)
        .get('/api/token')
        .expect(200)
        .expect('Content-Type', /text/)
        .expect(res => {
          token = res.text;
        })
    );

    it('should respond with a client token that is 1700 characters or more', () =>
      token.should.have.length.above(1700)
    );
  });
});
