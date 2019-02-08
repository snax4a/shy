/* globals describe, expect, test, beforeAll */

import app from '../../app';
import request from 'supertest';
import config from '../../config/environment';

describe('Class API:', () => {
  let newClassID;
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

  // class.controller.js:upsert
  describe('PUT /api/class/:id', () => {
    let newClass = {
      _id: 0,
      name: 'Class 1',
      description: 'Description 1',
      active: true
    };

    // Gives a 500 error rather than 401 if authorization header is not provided
    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .put('/api/class/0')
        .send(newClass)
        .expect(401, done)
    );

    test('should upsert the class when admin is authenticated and return a non-zero ID', () =>
      request(app)
        .put('/api/class/0')
        .set('authorization', `Bearer ${tokenAdmin}`)
        .send(newClass)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          newClassID = res.body._id;
          expect(newClassID).toBeGreaterThan(0);
        })
    );
  });

  // class.controller.js:index
  describe('GET /api/class', () =>
    test('should respond with JSON array', () =>
      request(app)
        .get('/api/class')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          const classes = res.body;
          expect(Array.isArray(classes)).toBe(true);
        })
    )
  );

  // class.controller.js:destroy
  describe('DELETE /api/class/:id', () => {
    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .delete(`/api/class/${newClassID}`)
        .expect(401, done)
    );

    test('should respond with a result code of 204 to confirm deletion when authenticated', done =>
      request(app)
        .delete(`/api/class/${newClassID}`)
        .set('authorization', `Bearer ${tokenAdmin}`)
        .expect(204, done)
    );
  });
});
