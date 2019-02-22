/* globals describe, expect, test, beforeAll */

import app from '../../app';
import request from 'supertest';
import config from '../../config/environment';

describe('File API:', () => {
  let newFileID;
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

  describe('POST /auth/local', () =>
    test('should authenticate the administrator and get token with length of 164', () =>
      expect(tokenAdmin).toHaveLength(164)
    )
  );

  // file.controller.js:upload
  describe('POST /api/file/upload', () => {
    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .post('/api/file/upload')
        .attach('file', 'client/assets/images/seal.svg')
        .expect(401, done)
    );

    test('should upload file when admin is authenticated and return a non-zero ID', () =>
      request(app)
        .post('/api/file/upload')
        .set('authorization', `Bearer ${tokenAdmin}`)
        .attach('file', 'client/assets/images/seal.svg')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          newFileID = res.body.id;
          expect(newFileID).toBeGreaterThan(0);
        })
    );
  });

  // file.controller.js:index
  describe('GET /api/file', () =>
    test('should respond with JSON array', () =>
      request(app)
        .get('/api/file')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          const files = res.body;
          expect(Array.isArray(files)).toBe(true);
        })
    )
  );

  // file.controller.js:index
  describe('GET /api/file/:id', () =>
    test('should respond with a file', () =>
      request(app)
        .get(`/api/file/${newFileID}`)
        .expect(200)
        .expect('Content-Type', /png/)
    )
  );

  // file.controller.js:destroy
  describe('DELETE /api/file/:id', () => {
    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .delete(`/api/file/${newFileID}`)
        .expect(401, done)
    );

    test('should respond with a result code of 204 to confirm deletion when authenticated', done =>
      request(app)
        .delete(`/api/file/${newFileID}`)
        .set('authorization', `Bearer ${tokenAdmin}`)
        .expect(204, done)
    );
  });
});
