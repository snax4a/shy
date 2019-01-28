/* globals describe, expect, test, beforeAll */

import app from '../../app';
import request from 'supertest';
import config from '../../config/environment';

describe('Announcement API:', () => {
  let newAnnouncementID;
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

  // announcement.controller.js:upsert
  describe('PUT /api/announcement/:id', () => {
    let newAnnouncement = {
      _id: 0,
      section: 'Section 1',
      title: 'Title 1',
      description: 'Description 1',
      expires: '2030-04-15T20:00:00.000-04:00'
    };

    // Gives a 500 error rather than 401 if authorization header is not provided
    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .put('/api/announcement/0')
        .send(newAnnouncement)
        .expect(401, done)
    );

    test('should upsert the announcement when admin is authenticated and return a non-zero ID', () =>
      request(app)
        .put('/api/announcement/0')
        .set('authorization', `Bearer ${tokenAdmin}`)
        .send(newAnnouncement)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          newAnnouncementID = res.body._id;
          expect(newAnnouncementID).toBeGreaterThan(0);
        })
    );
  });

  // announcement.controller.js:index
  describe('GET /api/announcement', () =>
    test('should respond with JSON array', () =>
      request(app)
        .get('/api/announcement')
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          const announcements = res.body;
          expect(Array.isArray(announcements)).toBe(true);
        })
    )
  );

  // announcement.controller.js:destroy
  describe('DELETE /api/announcement/:id', () => {
    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .delete(`/api/announcement/${newAnnouncementID}`)
        .expect(401, done)
    );

    test('should respond with a result code of 204 to confirm deletion when authenticated', done =>
      request(app)
        .delete(`/api/announcement/${newAnnouncementID}`)
        .set('authorization', `Bearer ${tokenAdmin}`)
        .expect(204, done)
    );
  });
});
