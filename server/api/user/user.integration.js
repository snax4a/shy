/* globals describe, expect, it, before, after */

'use strict';

import app from '../..';
import { User } from '../../sqldb';
import request from 'supertest';
import config from '../../config/environment';

describe('User API:', function() {
  var user;
  var userAdmin;

  // Creater regular user and lookup admin user
  before(function() {
    user = User.build({
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      phone: '412-555-1212',
      password: 'password',
      optOut: true
    });
    return user.save()
      .then(() => User.findOne({ where: { email: config.admin.email } }).then(function(foundAdminUser) {
        userAdmin = foundAdminUser;
        return userAdmin;
      })
    );
  });

  // Delete test users
  after(function() {
    return User.destroy({
      where: {
        $or: [
          { email: 'test@example.com' },
          { email: 'boaty@bitbucket.com' }
        ]
      }
    });
  });

  // user.controller.js:index
  describe('GET /api/users/', function() {
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

    it('should respond with a JSON array of users when authenticated', function(done) {
      request(app)
        .get('/api/users?filter=SHY')
        .set('authorization', `Bearer ${tokenAdmin}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.body.should.be.instanceof(Array));
          done();
        });
    });

    it('should respond with a 401 when not authenticated', function(done) {
      request(app)
        .get('/api/users?filter=SHY')
        .expect(401)
        .end(done);
    });
  });

  // user.controller.js:me
  describe('GET /api/users/me', function() {
    var token;

    before(function(done) {
      request(app)
        .post('/auth/local')
        .send({
          email: 'test@example.com',
          password: 'password'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) return done(err);
          token = res.body.token;
          done();
        });
    });

    it('should respond with the user\'s profile when authenticated', function(done) {
      request(app)
        .get('/api/users/me')
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if(err) return done(err);
          expect(res.body._id.toString()).to.equal(user._id.toString());
          done();
        });
    });

    it('should respond with a 401 when not authenticated', function(done) {
      request(app)
        .get('/api/users/me')
        .expect(401)
        .end(done);
    });
  });

  // user.controller.js:create
  describe('POST /api/users/', function() {
    it('should create a new user and return a JSON token', function(done) {
      request(app)
        .post('/api/users')
        .send({
          firstName: 'Boaty',
          lastName: 'McBoatface',
          email: 'boaty@bitbucket.com',
          password: 'password',
          phone: '412-555-1212'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(done);
    });
  });

  // user.controller.js:forgotPassword

  // user.controller.js:update

  // user.controller.js:upsert

  // user.controller.js:destroy
  describe('DELETE /api/users/:id', function() {
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
        .delete(`/api/users/${user._id}`)
        .expect(401)
        .end(done);
    });

    it('should respond with a result code of 204 to confirm deletion when authenticated', function(done) {
      request(app)
        .delete(`/api/users/${user._id}`)
        .set('authorization', `Bearer ${tokenAdmin}`)
        .expect(204)
        .end(done);
    });
  });
});
