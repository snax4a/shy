/* globals describe, it, before, expect, after */

import request from 'supertest';
import app from '../..';
import { authenticateLocal, destroyUser, roleSet, getUser } from './user.controller';

describe('User API Integration Tests:', function() {
  let user;
  let token;

  // Cleanup test user in case test didn't finish last time
  before(async function() {
    try {
      return await Promise.all([
        destroyUser('email', 'nul@bitbucket.com'),
        destroyUser('email', 'justin.case@bitbucket.com')
      ]);
    } catch(err) {
      console.error(err);
    }
  });

  // Cleanup test user in case test didn't finish last time
  after(async function() {
    try {
      return await Promise.all([
        destroyUser('email', 'nul@bitbucket.com'),
        destroyUser('email', 'justin.case@bitbucket.com')
      ]);
    } catch(err) {
      console.error(err);
    }
  });

  describe('1. POST /api/user - controller.create() - create student user', function() {
    it('should create a user', async() =>
      request(app)
        .post('/api/user')
        .send({
          firstName: 'Boaty',
          lastName: 'McBoatface',
          email: 'nul@bitbucket.com',
          passwordNew: 'password',
          passwordConfirm: 'password',
          optOut: false,
          phone: '000-000-0000',
          provider: 'local',
          google: null,
          role: 'admin' // try to hack permissions
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(async res => {
          // Get the token
          token = res.body.token;

          // Check database to ensure proper save
          user = await getUser('email', 'nul@bitbucket.com');
          user._id.should.be.above(0);
          user.email.should.equal('nul@bitbucket.com');
          user.role.should.equal('student'); // verify hack didn't work
          user.provider.should.equal('local');
          user.optOut.should.be.false;
          user.phone.should.equal('000-000-0000');
          user.firstName.should.equal('Boaty');
          user.lastName.should.equal('McBoatface');
          expect(user.google).to.be.null;
        }));
  });

  describe('2. GET /api/user/unsubscribe/:email - controller.unsubscribe() - opt out', function() {
    it('should unsubscribe the user from the newsletter', () =>
      request(app)
        .get('/api/user/unsubscribe/nul@bitbucket.com')
        .expect(200)
        .expect('Content-Type', /html/)
        .then(async res => {
          // Check the response
          res.text.should.equal('Unsubscribed nul@bitbucket.com from the newsletter.');

          // Refresh user from database and verify they opted out
          user = await getUser('email', 'nul@bitbucket.com');
          user.optOut.should.be.true;
        }));
  });

  describe('3. GET /api/user/me - controller.me() - retrieve profile', function() {
    it('should respond with a 401 when not authenticated', () =>
      request(app)
        .get('/api/user/me')
        .expect(401)
    );

    it('should unsubscribe the user from newsletters', () =>
      request(app)
        .get('/api/user/me')
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(async res => {
          // Check the response
          let userSent = res.body;
          userSent._id.should.be.above(0);
          userSent.email.should.equal('nul@bitbucket.com');
          userSent.role.should.equal('student'); // verify hack didn't work
          userSent.provider.should.equal('local');
          userSent.optOut.should.be.true;
          userSent.phone.should.equal('000-000-0000');
          userSent.firstName.should.equal('Boaty');
          userSent.lastName.should.equal('McBoatface');
          expect(userSent.google).to.be.null;
        }));
  });

  describe('4. PUT /api/user/:id - controller.update() - update profile', function() {
    it('should respond with a 401 when not authenticated', () =>
      request(app)
        .put(`/api/user/${user._id}`)
        .send({
          firstName: 'Boaty',
          lastName: 'McBoatface',
          email: 'nul@bitbucket.com',
          password: 'password',
          passwordNew: 'password1',
          passwordConfirm: 'password1',
          optOut: false,
          phone: '111-111-1111',
          // Send values that should be ignored
          provider: 'google',
          google: { id: '000000000000000'},
          role: 'admin' // try to hack permissions
        })
        .expect(401)
    );

    it('should update user profile and change password', () =>
      request(app)
        .put(`/api/user/${user._id}`)
        .send({
          firstName: 'Justin',
          lastName: 'Case',
          email: 'justin.case@bitbucket.com',
          password: 'password',
          passwordNew: 'password1',
          passwordConfirm: 'password1',
          optOut: false,
          phone: '111-111-1111',
          // Send values that should be ignored
          provider: 'google',
          google: { id: '000000000000000'},
          role: 'admin' // try to hack permissions
        })
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(async res => {
          // Check response
          const _id = res.body._id;
          _id.should.equal(user._id);

          // Refresh user from database and verify each field was updated
          user = await getUser('_id', _id);
          user.firstName.should.equal('Justin');
          user.lastName.should.equal('Case');
          user.phone.should.equal('111-111-1111');
          user.email.should.equal('justin.case@bitbucket.com');
          user.optOut.should.be.false;
          user.provider.should.equal('local');
          user.role.should.equal('student');
          expect(user.google).to.be.null;

          // Test new password
          const authenticatedUser = await authenticateLocal('justin.case@bitbucket.com', 'password1');
          authenticatedUser.should.not.be.false;
        }));
  });

  describe('5. POST /api/user/forgotpassword - controller.forgotPassword() - email new password', function() {
    it('should email user a new password (old one should not work)', () =>
      request(app)
        .post('/api/user/forgotpassword')
        .send({
          email: 'justin.case@bitbucket.com'
        })
        .expect(200)
        .expect('Content-Type', /html/)
        .then(async res => {
          // Check response
          res.text.should.equal('New password sent.');

          // Old password should not work
          const authenticatedUser = await authenticateLocal('justin.case@bitbucket.com', 'password1');
          authenticatedUser.should.be.false;
        }));
  });

  describe('6. POST /api/user/message - controller.messageSend() - email admins', function() {
    it('should email admins a message', () =>
      request(app)
        .post('/api/user/message')
        .send({
          email: 'justin.case@bitbucket.com',
          firstName: 'Justin',
          lastName: 'Case',
          optOut: true,
          question: 'This is a test question.'
        })
        .expect(200)
        .expect('Content-Type', /html/)
        .then(async res => {
          // Check response
          res.text.should.equal('Thanks for submitting your question or comment. We will respond shortly.');

          // Refresh user from database and verify they opted out
          user = await getUser('email', 'justin.case@bitbucket.com');
          user.optOut.should.be.true;
        }));
  });

  describe('7. POST /api/user/subscribe - controller.subscribe() - opt user in to newsletter list', function() {
    it('should email admins a message', () =>
      request(app)
        .post('/api/user/subscribe')
        .send({
          email: 'justin.case@bitbucket.com'
        })
        .expect(200)
        .expect('Content-Type', /html/)
        .then(async res => {
          // Check response
          res.text.should.equal('Thanks for subscribing to our newsletter.');

          // Refresh user from database and verify they opted out
          user = await getUser('email', 'justin.case@bitbucket.com');
          user.optOut.should.be.false;
        }));
  });

  describe('8. GET /api/user - controller.index() - get users', function() {
    it('should respond with a 401 when not authenticated', () =>
      request(app)
        .get('/api/user?filter=justin')
        .expect(401)
    );

    it('should respond with an array when authenticated as a student', async() => {
      user = await roleSet('justin.case@bitbucket.com', 'teacher');
      return request(app)
        .get('/api/user?filter=justin')
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          let users = res.body;
          users.should.be.instanceof(Array);
        });
    });

    it('should respond with a JSON array of users when authenticated as a teacher or admin', async() => {
      user = await roleSet('justin.case@bitbucket.com', 'teacher');
      return request(app)
        .get('/api/user?filter=justin')
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          let users = res.body;
          users.should.be.instanceof(Array);
        });
    });
  });

  describe('9. PUT /api/user/:id/admin - controller.upsert() - user upsert', function() {
    // Might be giving teachers too many privs here
    it('should respond with a 401 when not authenticated', () =>
      request(app)
        .put(`/api/user/${user._id}/admin`)
        .send({
          firstName: 'Boaty',
          lastName: 'McBoatface',
          email: 'nul@bitbucket.com',
          passwordNew: 'password',
          passwordConfirm: 'password',
          optOut: true,
          phone: '000-000-0000',
          provider: 'local',
          google: null,
          role: 'admin'
        })
        .expect(401)
    );

    it('should upsert the user\'s profile when admin is authenticated', () =>
      request(app)
        .put(`/api/user/${user._id}/admin`) // test user is updating their own profile
        .send({
          firstName: 'Boaty',
          lastName: 'McBoatface',
          email: 'nul@bitbucket.com', // changes email back from justin.case@bitbucket.com
          passwordNew: 'password', // changes password
          passwordConfirm: 'password',
          optOut: true,
          phone: '000-000-0000',
          provider: 'local',
          google: null,
          role: 'admin' // leave them as an admin for the final delete
        })
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(async res => {
          // Check response
          res.body.should.have.property('_id');
          res.body.should.have.property('email');
          res.body.should.have.property('firstName');
          res.body.should.have.property('lastName');
          res.body.should.have.property('phone');
          res.body.should.have.property('optOut');
          res.body.should.have.property('provider');
          res.body.should.have.property('role');

          // Verify the database
          // Check database to ensure proper save
          user = await getUser('email', 'nul@bitbucket.com');
          user._id.should.be.above(0);
          user.email.should.equal('nul@bitbucket.com');
          user.role.should.equal('admin'); // verify hack didn't work
          user.provider.should.equal('local');
          user.optOut.should.be.true;
          user.phone.should.equal('000-000-0000');
          user.firstName.should.equal('Boaty');
          user.lastName.should.equal('McBoatface');
          expect(user.google).to.be.null;

          // Verify password change
          const authenticatedUser = await authenticateLocal('nul@bitbucket.com', 'password');
          authenticatedUser.should.not.be.false;
        }));
  });

  describe('10. DELETE /api/user/:id - controller.destroy() - delete user', function() {
    it('should respond with a 401 when not authenticated', () =>
      request(app)
        .delete(`/api/user/${user._id}`)
        .expect(401)
    );

    // Depends on current user having admin role
    it('should respond with a result code of 204 to confirm deletion when authenticated', async() => {
      try {
        user = await roleSet('nul@bitbucket.com', 'admin');
      } catch(err) {
        throw new Error('Could not find the user to elevate their role.');
      }

      return request(app)
        .delete(`/api/user/${user._id}`)
        .set('authorization', `Bearer ${token}`)
        .expect(204);
    });
  });
});
