/* globals describe, test, jest, beforeAll, expect, afterAll */

import request from 'supertest';
import app from '../../app';
import { authenticateLocal, destroyUser, roleSet, getUser } from './user.controller';

import * as sib from '../sendinblue'; // for mocking

describe('User API Integration Tests:', () => {
  let user;
  let token;
  const sibMock = jest.spyOn(sib, 'sibSubmit');
  sibMock.mockImplementation(() => 'Calling sibSubmit()');

  // Cleanup test user in case test didn't finish last time
  beforeAll(async() => {
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
  afterAll(async() => {
    try {
      return await Promise.all([
        destroyUser('email', 'nul@bitbucket.com'),
        destroyUser('email', 'justin.case@bitbucket.com')
      ]);
    } catch(err) {
      console.error(err);
    }
  });

  describe('1. POST /api/user - controller.create() - create student user', () => {
    const userToPost = {
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
    };
    test('should create a user', async() =>
      request(app)
        .post('/api/user')
        .send(userToPost)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(async res => {
          // Get the token
          token = res.body.token;

          // Check database to ensure proper save
          user = await getUser('email', userToPost.email);
          expect(user._id).toBeGreaterThan(0);
          expect(user.email).toBe(userToPost.email);
          expect(user.provider).toBe(userToPost.provider);
          expect(user.optOut).toBe(false);
          expect(user.phone).toBe(userToPost.phone);
          expect(user.firstName).toBe(userToPost.firstName);
          expect(user.lastName).toBe(userToPost.lastName);
          expect(user.google).toBe(null);
          expect(user.role).toBe('student'); // verify hack didn't work
          return user;
        }));
  });

  describe('2. GET /api/user/unsubscribe/:email - controller.unsubscribe() - opt out', () => {
    test('should unsubscribe the user from the newsletter updating the database and SendInBlue', () =>
      request(app)
        .get('/api/user/unsubscribe/nul@bitbucket.com')
        .expect(200)
        .expect('Content-Type', /html/)
        .then(async res => {
          // Check the response
          expect(res.text).toBe('Unsubscribed nul@bitbucket.com from the newsletter.');

          // Refresh user from database and verify they opted out
          user = await getUser('email', 'nul@bitbucket.com');
          expect(user.optOut).toBe(true);
          return user;
        }));
  });

  describe('3. GET /api/user/me - controller.me() - retrieve profile', () => {
    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .get('/api/user/me')
        .expect(401, done)
    );

    test('should unsubscribe the user from newsletters', () =>
      request(app)
        .get('/api/user/me')
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(async res => {
          // Check the response
          let userSent = res.body;
          expect(userSent._id).toBeGreaterThan(0);
          expect(userSent.email).toBe('nul@bitbucket.com');
          expect(userSent.role).toBe('student'); // verify hack didn't work
          expect(userSent.provider).toBe('local');
          expect(userSent.optOut).toBe(true);
          expect(userSent.phone).toBe('000-000-0000');
          expect(userSent.firstName).toBe('Boaty');
          expect(userSent.lastName).toBe('McBoatface');
          expect(userSent.google).toBe(null);
          return userSent;
        }));
  });

  describe('4. PUT /api/user/:id - controller.update() - update profile', () => {
    const userForPut = {
      firstName: 'Justin',
      lastName: 'Case',
      email: 'justin.case@bitbucket.com',
      password: 'password',
      passwordNew: 'password1',
      passwordConfirm: 'password1',
      optOut: false,
      phone: '111-111-1111',
      // Send values that should be ignored
      role: 'admin', // try to hack permissions
      provider: 'google',
      google: { id: '000000000000000'}
    };

    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .put(`/api/user/${user._id}`)
        .send(userForPut)
        .expect(401, done)
    );

    test('should update user profile (without allowing restricted field changes) and change password', () =>
      request(app)
        .put(`/api/user/${user._id}`)
        .send(userForPut)
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(async res => {
          // Check response
          const _id = res.body._id;
          expect(_id).toBe(user._id);

          // Refresh user from database and verify each field was updated
          user = await getUser('_id', _id);
          expect(user.firstName).toBe(userForPut.firstName);
          expect(user.lastName).toBe(userForPut.lastName);
          expect(user.phone).toBe(userForPut.phone);
          expect(user.email).toBe(userForPut.email);
          expect(user.optOut).toBe(false);
          expect(user.role).toBe('student');
          expect(user.provider).toBe('local');
          expect(user.google).toBe(null);

          // Test new password
          const authenticatedUser = await authenticateLocal(userForPut.email, userForPut.passwordNew);
          expect(authenticatedUser).toHaveProperty('_id');
          expect(authenticatedUser).toHaveProperty('email');

          return user;
        }));
  });

  describe('5. POST /api/user/forgotpassword - controller.forgotPassword() - email new password', () => {
    test('should email user a new password (old one should not work)', () =>
      request(app)
        .post('/api/user/forgotpassword')
        .send({
          email: 'justin.case@bitbucket.com'
        })
        .expect(200)
        .expect('Content-Type', /html/)
        .then(async res => {
          // Check response
          expect(res.text).toBe('New password sent.');

          // Old password should not work
          const authenticatedUser = await authenticateLocal('justin.case@bitbucket.com', 'password1');
          expect(authenticatedUser).toBe(false);

          return res.text;
        }));
  });

  describe('6. POST /api/user/message - controller.messageSend() - email admins', () => {
    test('should email admins a message', () =>
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
          expect(res.text).toBe('Thanks for submitting your question or comment. We will respond shortly.');

          // Refresh user from database and verify they opted out
          user = await getUser('email', 'justin.case@bitbucket.com');
          expect(user.optOut).toBe(true);

          return user;
        }));
  });

  describe('7. POST /api/user/subscribe - controller.subscribe() - opt user in to newsletter list', () => {
    test('should email admins a message via SendInBlue', () =>
      request(app)
        .post('/api/user/subscribe')
        .send({
          email: 'justin.case@bitbucket.com'
        })
        .expect(200)
        .expect('Content-Type', /html/)
        .then(async res => {
          // Check response
          expect(res.text).toBe('Thanks for subscribing to our newsletter.');

          // Refresh user from database and verify they opted out
          user = await getUser('email', 'justin.case@bitbucket.com');
          expect(user.optOut).toBe(false);

          return user;
        }));
  });

  describe('8. GET /api/user - controller.index() - get users', () => {
    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .get('/api/user?filter=justin')
        .expect(401, done)
    );

    const getApiUserWithFilter = () =>
      request(app)
        .get('/api/user?filter=justin')
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          let users = res.body;
          expect(Array.isArray(users)).toBe(true);
          return users;
        });

    test('should respond with a JSON array when authenticated as a teacher', async() => {
      user = await roleSet('justin.case@bitbucket.com', 'admin');
      return getApiUserWithFilter();
    });

    test('should respond with a JSON array of users when authenticated as an admin', async() => {
      user = await roleSet('justin.case@bitbucket.com', 'teacher');
      return getApiUserWithFilter();
    });
  });

  describe('9. PUT /api/user/:id/admin - controller.upsert() - user upsert', () => {
    const userToPut = {
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
    };

    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .put(`/api/user/${user._id}/admin`)
        .send(userToPut)
        .expect(401, done)
    );

    test('should upsert the user\'s profile (without changes to sensitive fields) when teacher is authenticated', () =>
      request(app)
        .put(`/api/user/${user._id}/admin`) // test user is updating their own profile
        .send(userToPut)
        .set('authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(async res => {
          // Check response
          expect(res.body).toHaveProperty('_id');
          expect(res.body).toHaveProperty('email');
          expect(res.body).toHaveProperty('firstName');
          expect(res.body).toHaveProperty('lastName');
          expect(res.body).toHaveProperty('phone');
          expect(res.body).toHaveProperty('optOut');
          expect(res.body).toHaveProperty('provider');
          expect(res.body).toHaveProperty('role');

          // Verify the database
          // Check database to ensure proper save
          user = await getUser('email', userToPut.email);
          expect(user._id).toBeGreaterThan(0);
          expect(user.email).toBe(userToPut.email);
          expect(user.role).toBe('teacher'); // verify hack didn't work
          expect(user.provider).toBe(userToPut.provider);
          expect(user.optOut).toBe(true);
          expect(user.phone).toBe(userToPut.phone);
          expect(user.firstName).toBe(userToPut.firstName);
          expect(user.lastName).toBe(userToPut.lastName);
          expect(user.google).toBe(null);

          // Verify password change failed because a teacher attempted it
          const authenticatedUser = await authenticateLocal(userToPut.email, userToPut.passwordNew);
          expect(authenticatedUser).toBe(false);

          return authenticatedUser;
        }));
  });

  describe('10. DELETE /api/user/:id - controller.destroy() - delete user', () => {
    beforeAll(async() => {
      try {
        user = await roleSet('nul@bitbucket.com', 'admin');
        return user;
      } catch(err) {
        throw new Error('Could not find the user to elevate their role.');
      }
    });

    test('should respond with a 401 when not authenticated', done =>
      request(app)
        .delete(`/api/user/${user._id}`)
        .expect(401, done)
    );

    // Depends on current user having admin role
    test('should respond with a result code of 204 to confirm deletion when authenticated', done =>
      request(app)
        .delete(`/api/user/${user._id}`)
        .set('authorization', `Bearer ${token}`)
        .expect(204, done)
    );
  });
});
