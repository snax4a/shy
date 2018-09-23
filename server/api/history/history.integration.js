/* globals describe, it, before, beforeEach */
'use strict';

import app from '../..';
import request from 'supertest';
import config from '../../config/environment';

describe('History API:', () => {
  let newID;
  let tokenAdmin;

  // Authenticate the administrator
  before(() =>
    request(app)
      .post('/auth/local')
      .send({
        email: config.admin.email,
        password: config.admin.password
      })
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        tokenAdmin = res.body.token;
      })
  );

  describe('POST /auth/local', () => {
    it('should authenticate the administrator and get token with length of 164', () =>
      tokenAdmin.should.have.length(164));
  });

  // history.controller.js:update
  describe('POST /api/history', () => {
    let newHistoryItem = {
      UserId: 24601, // should dynamically create user
      type: 'P',
      quantity: 3,
      method: 'Cash',
      notes: 'Integration test'
    };

    // Gives a 500 error rather than 401 if authorization header is not provided
    it('should respond with a 401 when not authenticated', () =>
      request(app)
        .post('/api/history')
        .send(newHistoryItem)
        .expect(401)
    );

    it('should upsert the history item when admin is authenticated and return a non-zero ID', () =>
      request(app)
        .post('/api/history')
        .set('authorization', `Bearer ${tokenAdmin}`)
        .send(newHistoryItem)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          newID = res.body._id;
          newID.should.be.above(0);
        })
    );
  });

  // history.controller.js:update
  describe('PUT /api/history/:id', () => {
    let newHistoryItem = {
      _id: 72,
      UserId: 24601, // should dynamically create user
      type: 'P',
      quantity: 3,
      method: 'Cash',
      notes: 'Integration test'
    };

    // Gives a 500 error rather than 401 if authorization header is not provided
    it('should respond with a 401 when not authenticated', () =>
      request(app)
        .put('/api/history/72?type=P') // Don't hardcode in future
        .send(newHistoryItem)
        .expect(401)
    );

    it('should update the history item when admin is authenticated and return a non-zero ID', () =>
      request(app)
        .put('/api/history/72?type=P') // Don't hardcode in future
        .set('authorization', `Bearer ${tokenAdmin}`)
        .send(newHistoryItem)
        .expect(200)
    );
  });

  // history.controller.js:index
  describe('GET /api/history/attendees', () => {
    let attendees;

    it('should respond with a 401 when not authenticated', () =>
      request(app)
        .get('/api/history/attendees') // shouldn't hardcode user ID
        .expect(401)
    );

    it('should respond with a result code of 200 to confirm when authenticated', () =>
      request(app)
        .get('/api/history/attendees?attended=2018-09-01&location=Squirrel+Hill&teacher=Koontz,+Leta&classTitle=Yoga+1')
        .set('authorization', `Bearer ${tokenAdmin}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          attendees = res.body;
        })
    );

    it('should respond with JSON array', () => attendees.should.be.instanceOf(Array));
  });

  // history.controller.js:index
  describe('GET /api/history/:id', () => {
    let historyItems;

    it('should respond with a 401 when not authenticated', () =>
      request(app)
        .get('/api/history/24601') // shouldn't hardcode user ID
        .expect(401)
    );

    it('should respond with a result code of 200 to confirm when authenticated', () =>
      request(app)
        .get('/api/history/24601')
        .set('authorization', `Bearer ${tokenAdmin}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          historyItems = res.body;
        })
    );

    it('should respond with JSON array', () => historyItems.should.be.instanceOf(Array));
  });

  // history.controller.js:destroy
  describe('DELETE /api/history/:id', () => {
    it('should respond with a 401 when not authenticated', () =>
      request(app)
        .delete(`/api/history/${newID}?type=P`)
        .expect(401)
    );

    it('should respond with a result code of 204 to confirm deletion when authenticated', () =>
      request(app)
        .delete(`/api/history/${newID}?type=P`)
        .set('authorization', `Bearer ${tokenAdmin}`)
        .expect(204)
    );
  });
});
