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
  describe('POST /api/file', () => {
    let newFile = {
      name: 'test-file.jpg',
      type: 'image/jpg',
      data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
    };

    // Gives a 500 error rather than 401 if authorization header is not provided
    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .post('/api/file')
        .send(newFile)
        .expect(401, done)
    );

    test('should upsert the class when admin is authenticated and return a non-zero ID', () =>
      request(app)
        .post('/api/file')
        .set('authorization', `Bearer ${tokenAdmin}`)
        .send(newFile)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          newFileID = res.body._id;
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
    test('should respond with an image', () =>
      request(app)
        .get(`/api/file/${newFileID}`)
        .expect(200)
        .expect('Content-Type', /jpg/)
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
