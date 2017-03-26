'use strict';

/* globals before, describe, expect, it, beforeEach */

import app from '../..';
import request from 'supertest';
import config from '../../config/environment';

describe('Schedule API:', function() {
  var newScheduleItemID;

  describe('GET /api/schedule', function() {
    var schedules;

    beforeEach(function(done) {
      request(app)
        .get('/api/schedule')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          schedules = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(schedules).to.be.instanceOf(Array);
    });
  });

  // schedule.controller.js:upsert
  describe('PUT /api/schedule/:id', function() {
    var tokenAdmin;

    before(function(done) {
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
        });
    });

    it('should upsert the schedule\'s profile when admin is authenticated', function(done) {
      request(app)
        .put('/api/schedule/0')
        .send({
          _id: 0,
          location: 'Test',
          day: 'Sunday',
          title: 'Yoga 1',
          teacher: 'Leta Koontz',
          startTime: '09:00:00.000000',
          endTime: '10:30:00.000000'
        })
        .set('authorization', `Bearer ${tokenAdmin}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) return done(err);
          newScheduleItemID = res.body._id;
          expect(newScheduleItemID).to.be.above(0);
          done();
        });
    });

    it('should respond with a 401 when not authenticated', function(done) {
      request(app)
        .put('/api/schedule/0')
        .expect(401)
        .end(done);
    });
  });

  // schedule.controller.js:destroy
  describe('DELETE /api/schedule/:id', function() {
    var tokenAdmin;

    before(function(done) {
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
        });
    });

    it('should respond with a 401 when not authenticated', function(done) {
      request(app)
        .delete(`/api/schedule/${newScheduleItemID}`)
        .expect(401)
        .end(done);
    });

    it('should respond with a result code of 204 to confirm deletion when authenticated', function(done) {
      request(app)
        .delete(`/api/schedule/${newScheduleItemID}`)
        .set('authorization', `Bearer ${tokenAdmin}`)
        .expect(204)
        .end(done);
    });
  });
});
