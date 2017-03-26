/* globals describe, expect, it, before, beforeEach */

'use strict';

import app from '../..';
import request from 'supertest';
import config from '../../config/environment';

describe('Announcement API:', function() {
  var newAnnouncementID;

  // announcement.controller.js:index
  describe('GET /api/announcement', function() {
    var announcements;

    beforeEach(function(done) {
      request(app)
        .get('/api/announcement')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) {
            return done(err);
          }
          announcements = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      expect(announcements).to.be.instanceOf(Array);
    });
  });


  // announcement.controller.js:upsert
  describe('PUT /api/announcement/:id', function() {
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

    it('should upsert the announcement\'s profile when admin is authenticated', function(done) {
      request(app)
        .put('/api/announcement/0')
        .send({
          _id: 0,
          section: 'Section 1',
          title: 'Title 1',
          description: 'Description 1',
          expires: '2017-04-15T20:00:00.000-04:00'
        })
        .set('authorization', `Bearer ${tokenAdmin}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) return done(err);
          newAnnouncementID = res.body._id;
          expect(newAnnouncementID).to.be.above(0);
          done();
        });
    });

    it('should respond with a 401 when not authenticated', function(done) {
      request(app)
        .put('/api/announcement/0')
        .expect(401)
        .end(done);
    });
  });

  // user.controller.js:destroy
  describe('DELETE /api/announcement/:id', function() {
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
        .delete(`/api/announcement/${newAnnouncementID}`)
        .expect(401)
        .end(done);
    });

    it('should respond with a result code of 204 to confirm deletion when authenticated', function(done) {
      request(app)
        .delete(`/api/announcement/${newAnnouncementID}`)
        .set('authorization', `Bearer ${tokenAdmin}`)
        .expect(204)
        .end(done);
    });
  });

});
