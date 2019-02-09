/* globals describe, test, beforeAll, expect */

import app from '../../app';
import request from 'supertest';
import config from '../../config/environment';

describe('History API:', () => {
  let newID;
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

  // history.controller.js:update
  describe('POST /api/history', () => {
    let newHistoryItem = {
      UserId: 24601, // should dynamically create user
      type: 'P',
      quantity: 3,
      method: 'Cash',
      notes: 'Integration test',
      purchased: '2018-12-01'
    };

    // Gives a 500 error rather than 401 if authorization header is not provided
    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .post('/api/history')
        .send(newHistoryItem)
        .expect(401, done)
    );

    test('should create the history item when admin is authenticated and return a non-zero ID', () =>
      request(app)
        .post('/api/history')
        .set('authorization', `Bearer ${tokenAdmin}`)
        .send(newHistoryItem)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          newID = res.body._id;
          expect(newID).toBeGreaterThan(0);
        })
    );
  });

  // history.controller.js:update
  describe('PUT /api/history/:id', () => {
    let newHistoryItem = {
      _id: 295707,
      UserId: 24601, // should dynamically create user
      type: 'P',
      quantity: 3,
      method: 'Cash',
      notes: 'Integration test',
      purchased: '2018-12-01'
    };

    // Gives a 500 error rather than 401 if authorization header is not provided
    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .put('/api/history/72?type=P') // Don't hardcode in future
        .send(newHistoryItem)
        .expect(401, done)
    );

    test('should update the history item when admin is authenticated and return a non-zero ID', done =>
      request(app)
        .put('/api/history/72?type=P') // Don't hardcode in future
        .set('authorization', `Bearer ${tokenAdmin}`)
        .send(newHistoryItem)
        .expect(200, done)
    );
  });

  // history.controller.js:index
  describe('GET /api/history/attendees', () => {
    let attendees;

    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .get('/api/history/attendees') // shouldn't hardcode user ID
        .expect(401, done)
    );

    test('should respond with a result code of 200 to confirm when authenticated', done =>
      request(app)
        .get('/api/history/attendees?attended=2018-09-01&location=Squirrel+Hill&teacher=Koontz,+Leta&className=Yoga+1')
        .set('authorization', `Bearer ${tokenAdmin}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) return done(err);
          attendees = res.body;
          done();
        })
    );

    test('should respond with JSON array', () => expect(Array.isArray(attendees)).toBe(true));
  });

  // history.controller.js:index
  describe('GET /api/history/:id', () => {
    let historyItems;

    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .get('/api/history/24601') // shouldn't hardcode user ID
        .expect(401, done)
    );

    test('should respond with a result code of 200 to confirm when authenticated', done =>
      request(app)
        .get('/api/history/24601')
        .set('authorization', `Bearer ${tokenAdmin}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) return done(err);
          historyItems = res.body;
          done();
        })
    );

    test('should respond with JSON array', () => expect(Array.isArray(historyItems)).toBe(true));
  });

  // history.controller.js:destroy
  describe('DELETE /api/history/:id', () => {
    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .delete(`/api/history/${newID}?type=P`)
        .expect(401, done)
    );

    test('should respond with a result code of 204 to confirm deletion when authenticated', done =>
      request(app)
        .delete(`/api/history/${newID}?type=P`)
        .set('authorization', `Bearer ${tokenAdmin}`)
        .expect(204, done)
    );
  });
});
