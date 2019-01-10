/* globals describe, it, before, beforeEach */

import app from '../..';
import request from 'supertest';
import config from '../../config/environment';

describe('Announcement API:', function() {
  let newAnnouncementID;
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
      .then(res => {
        tokenAdmin = res.body.token;
      })
  );

  describe('POST /auth/local', function() {
    it('should authenticate the administrator and get token with length of 164', () =>
      tokenAdmin.should.have.length(164));
  });

  // announcement.controller.js:upsert
  describe('PUT /api/announcement/:id', function() {
    let newAnnouncement = {
      _id: 0,
      section: 'Section 1',
      title: 'Title 1',
      description: 'Description 1',
      expires: '2030-04-15T20:00:00.000-04:00'
    };

    // Gives a 500 error rather than 401 if authorization header is not provided
    it('should respond with a 401 when not authenticated', () =>
      request(app)
        .put('/api/announcement/0')
        .send(newAnnouncement)
        .expect(401)
    );

    it('should upsert the announcement when admin is authenticated and return a non-zero ID', () =>
      request(app)
        .put('/api/announcement/0')
        .set('authorization', `Bearer ${tokenAdmin}`)
        .send(newAnnouncement)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          newAnnouncementID = res.body._id;
          newAnnouncementID.should.be.above(0);
        })
    );
  });

  // announcement.controller.js:index
  describe('GET /api/announcement', function() {
    let announcements;

    // Retrieve list of announcements each time before testing
    beforeEach(() =>
      request(app)
        .get('/api/announcement')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          announcements = res.body;
        })
    );

    it('should respond with JSON array', () => announcements.should.be.instanceOf(Array));
  });

  // announcement.controller.js:destroy
  describe('DELETE /api/announcement/:id', function() {
    it('should respond with a 401 when not authenticated', () =>
      request(app)
        .delete(`/api/announcement/${newAnnouncementID}`)
        .expect(401)
    );

    it('should respond with a result code of 204 to confirm deletion when authenticated', () =>
      request(app)
        .delete(`/api/announcement/${newAnnouncementID}`)
        .set('authorization', `Bearer ${tokenAdmin}`)
        .expect(204)
    );
  });
});
