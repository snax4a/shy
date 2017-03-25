/* globals describe, expect, it, before, beforeEach, after */

'use strict';

import app from '../..';
import request from 'supertest';
import { User } from '../../sqldb';

describe('Announcement API:', function() {
  var user;
  var admin;

    // Create admin user
  before(function() {
    user = User.build({
      firstName: 'SHY',
      lastName: 'Admin',
      email: 'admin@example.com',
      phone: '412-555-1212',
      password: 'password',
      role: 'admin',
      provider: 'local',
      optOut: true
    });
    return user.save()
      .then(function(savedUser) {
        admin = savedUser;
        return admin;
      });
  });

  // Delete test admin
  after(function() {
    return User.destroy({ where: { email: 'admin@example.com' } });
  });

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
          email: user.email,
          password: user.password
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
          expect(res.body._id.toString()).to.equal(announcement._id.toString());
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
          email: user.email,
          password: user.password
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
        .delete(`/api/announcement/${announcement._id}`)
        .expect(401)
        .end(done);
    });

    it('should respond with a result code of 204 to confirm deletion when authenticated', function(done) {
      request(app)
        .delete(`/api/announcement/${announcement._id}`)
        .set('authorization', `Bearer ${tokenAdmin}`)
        .expect(204)
        .end(done);
    });
  });

});
