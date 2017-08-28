/* globals describe, expect, it, before, beforeEach */

'use strict';

import app from '../..';
import request from 'supertest';
import config from '../../config/environment';

describe('Announcement API:', () => {
  let newAnnouncementID;

  // announcement.controller.js:index
  describe('GET /api/announcement', () => {

    it('should respond with JSON array', () => {
      return request(app)
        .get('/api/announcement')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          let announcements = res.body;
          announcements.should.be.instanceOf(Array);
        });
    });

  });

  // announcement.controller.js:upsert
  describe('PUT /api/announcement/:id', () => {
    let newAnnouncement = {
      _id: 0,
      section: 'Section 1',
      title: 'Title 1',
      description: 'Description 1',
      expires: '2018-04-15T20:00:00.000-04:00'
    };
    let tokenAdmin;

    before(() => {
      return request(app)
        .post('/auth/local')
        .send({
          email: config.admin.email,
          password: config.admin.password
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          tokenAdmin = res.body.token;
        });
    });

    it('should upsert the announcement when admin is authenticated and return a non-zero ID', () => {
      return request(app)
        .put('/api/announcement/0')
        .send(newAnnouncement)
        .set('authorization', `Bearer ${tokenAdmin}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          let newAnnouncementID = res.body._id;
          newAnnouncementID.should.be.above(0);
        })
    });

    // Gives a 500 error rather than 401 (bug)
    it('should respond with a 401 when not authenticated', () => {
      return request(app)
        .put('/api/announcement/0')
        .send(newAnnouncement)
        .expect(401)
    });
  });

  // announcement.controller.js:destroy
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
          return done();
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
