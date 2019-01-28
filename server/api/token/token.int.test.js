/* global describe, expect, test */

import app from '../../app';
import request from 'supertest';

describe('Token API:', () =>
  describe('GET /api/token', () =>
    test('should respond with a client token that is 2052 characters or more', done =>
      request(app)
        .get('/api/token')
        .expect(200)
        .expect('Content-Type', /text/)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.text).toHaveLength(2052);
          done();
        })
    )
  )
);
