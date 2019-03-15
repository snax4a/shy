/* globals describe, expect, test, beforeAll */

import app from '../../app';
import request from 'supertest';
import config from '../../config/environment';

describe('Report API:', () => {
  let tokenAdmin;

  // Authenticate the administrator
  beforeAll(done =>
    request(app)
      .post('/auth/local')
      .send({
        email: config.admin.email,
        password: config.admin.password
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if(err) return done(err);
        tokenAdmin = res.body.token;
        done();
      })
  );

  describe('POST /auth/local', () => {
    test('should authenticate the administrator and get token with length of 164', () =>
      expect(tokenAdmin).toHaveLength(164)
    );
  });

  // report.controller.js:index
  describe('GET /api/report', () => {
    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .get('/api/report/?name=top10students')
        .expect(401, done)
    );
  });

  // report.controller.js:index
  describe('GET /api/report', () => {
    test('should respond with JSON array', () =>
      request(app)
        .get('/api/report/?name=top10students')
        .set('authorization', `Bearer ${tokenAdmin}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          const reportResults = res.body;
          expect(Array.isArray(reportResults)).toBe(true);
        })
    );
  });
});
