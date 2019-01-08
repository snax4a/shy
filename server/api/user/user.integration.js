/* globals describe, it, before, after */

import app from '../..';
import { User } from '../../utils/sqldb';
import request from 'supertest';

describe('User API:', () => {
  const email = 'nul@bitbucket.com';
  const password = 'password';
  const passwordNew = 'password';
  const passwordConfirm = 'password';
  let token;
  let user; // Set by getUserProfile()

  // Factory function to create user
  const createUser = function() {
    return {
      firstName: 'Boaty',
      lastName: 'McBoatface',
      email,
      password,
      passwordNew,
      passwordConfirm,
      optOut: false,
      phone: '412-555-1212',
      provider: 'local',
      role: 'admin'
    };
  };

  // For API calls that make changes
  let updatedUser = createUser();
  updatedUser.firstName = 'Something';
  updatedUser.lastName = 'Changed';
  updatedUser.optOut = true;
  updatedUser.phone = '000-000-0000';

  // Retrieve the current user
  const getUserProfile = () =>
    request(app)
      .get('/api/user/me')
      .set('authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        user = res.body;
      });

  // Delete student test account (if it exists) then sign-up and get token
  const recreate = () =>
    User.destroy({ where: { email } })
      .then(() =>
        request(app)
          .post('/api/user')
          .send(createUser())
          .expect(200)
          .expect('Content-Type', /json/)
          .expect(res => {
            token = res.body.token;
          })
      );

  // Only delete the student test account
  const destroy = () => User.destroy({ where: { email } });

  // Change user's role
  const setRole = role =>
    User.findOne({ where: { email } })
      .then(foundUser => {
        foundUser.role = role;
        return foundUser.save();
      });

  describe('Methods for anyone:', function() {
    before(() => recreate());
    after(() => destroy());

    // Check token from user.controller.js:create (sign-up)
    describe('POST /api/user/', () => {
      it('should return 144 character token to indicate successful sign-up', () =>
        token.should.have.length(144)
      );
    });

    describe('POST /api/user/message', function() {
      let response = '';

      before(() =>
        request(app)
          .post('/api/user/message')
          .send({
            firstName: 'John',
            lastName: 'Doe',
            email: 'nul@bitbucket.com',
            question: 'This is a question',
            optOut: false,
            role: 'student',
            provider: 'local'
          })
          .expect(200)
          .expect('Content-Type', /html/)
          .expect(res => {
            response = res.text;
          })
      );

      // Delete test user
      after(() =>
        User.destroy({
          where: {
            email: 'jdoe@gmail.com'
          }
        })
      );

      it('should send response thanking the user for submitting a question or comment', () =>
        response.should.equal('Thanks for submitting your question or comment. We will respond shortly.'));
    });

    // Check response from user.controller.js:forgotPassword
    describe('POST /api/user/forgotpassword', function() {
      it('should generate a new password and email it to the user', () =>
        request(app)
          .post('/api/user/forgotpassword')
          .send({ email })
          .expect(200)
          .expect('Content-Type', /html/)
          .expect(res => {
            res.text.should.equal('New password sent.');
          })
      );
    });
  });

  describe('Methods for current user:', function() {
    before(() => recreate());
    after(() => destroy());

    // user.controller.js:me
    describe('GET /api/user/me', function() {
      it('should respond with a 401 when not authenticated', () =>
        request(app)
          .get('/api/user/me')
          .expect(401)
      );

      it('should respond with student profile with proper defaults when authenticated', () =>
        getUserProfile()
          .then(() => {
            user._id.should.be.above(0);
            user.email.should.equal(email);
            user.role.should.equal('admin');
            user.provider.should.equal('local');
            user.optOut.should.be.false;
          })
      );
    });

    // Check response from user.controller.js:update
    describe('PUT /api/user/:id', function() {
      it('should respond with a 401 when not authenticated', () =>
        getUserProfile()
          .then(() =>
            request(app)
              .put(`/api/user/${user._id}`)
              .send(updatedUser)
              .expect(401)
          )
      );

      // 422 error from user.controller.js:update - bad password!
      it('should update the user\'s profile when authenticated', () =>
        getUserProfile()
          .then(() =>
            request(app)
              .put(`/api/user/${user._id}`)
              .set('authorization', `Bearer ${token}`)
              .send(updatedUser)
              .expect(200)
              .expect('Content-Type', /json/)
              .expect(res => {
                let userId = res.body._id.toString();
                userId.should.equal(user._id.toString()); // verify API
                return User.findOne({ where: { email } })
                  .then(foundUser => {
                    // Now verify updates made it to database
                    foundUser.firstName.should.equal(updatedUser.firstName);
                    foundUser.lastName.should.equal(updatedUser.lastName);
                    foundUser.phone.should.equal(updatedUser.phone);
                    foundUser.optOut.should.be.true;
                  });
              })
          )
      );
    });
  });

  describe('Methods for teachers or admins:', function() {
    // Recreate user, change role to teacher (think about testing for admin, too)
    before(() =>
      recreate()
        .then(() => setRole('admin')) // teacher role seems to be broken right now (address later)
    );
    after(() => destroy()); // should be done by DELETE /api/user/:id but here in case of errors

    // controller.index (teacher or admin)
    describe('GET /api/user/', function() {
      it('should respond with a 401 when not authenticated', () =>
        request(app)
          .get('/api/user?filter=SHY')
          .expect(401)
      );

      it('should respond with a JSON array of users when authenticated', () =>
        request(app)
          .get('/api/user?filter=SHY')
          .set('authorization', `Bearer ${token}`)
          .expect(200)
          .expect('Content-Type', /json/)
          .expect(res => {
            let users = res.body;
            users.should.be.instanceof(Array);
          })
      );
    });

    // controller.upsert (teacher or admin)
    describe('PUT /api/user/:id/admin', function() {
      it('should respond with a 401 when not authenticated', () =>
        request(app)
          .put(`/api/user/${user._id}/admin`)
          .expect(401)
      );

      it('should upsert the user\'s profile when admin is authenticated', () =>
        getUserProfile() // We are upserting the user that is authenticated
          .then(() => {
            // Add fields normally sent from admin UI
            updatedUser._id = user._id;
            // console.log(updatedUser);
            return request(app)
              .put(`/api/user/${user._id}/admin`) // test user is updating their own profile
              .send(updatedUser)
              .set('authorization', `Bearer ${token}`)
              .expect(200)
              .expect('Content-Type', /json/)
              .expect(res => {
                let userId = res.body._id.toString();
                userId.should.equal(user._id.toString());
              });
          })
      );
    });

    // controller.destroy (admin only)
    describe('DELETE /api/user/:id', function() {
      it('should respond with a 401 when not authenticated', () =>
        request(app)
          .delete(`/api/user/${user._id}`)
          .expect(401)
      );

      // Depends on current user having admin role
      it('should respond with a result code of 204 to confirm deletion when authenticated', () =>
        request(app)
          .delete(`/api/user/${user._id}`)
          .set('authorization', `Bearer ${token}`)
          .expect(204)
      );
    });

    describe('POST /api/user/subscribe', function() {
      let newSubscriber = {
        email: 'nul@bitbucket.com'
      };

      it('should send response thanking the user for subscribing to the newsletter', () =>
        request(app)
          .post('/api/user/subscribe')
          .send(newSubscriber)
          .expect(200)
          .expect('Content-Type', /html/)
          .expect(res => {
            let response = res.text.toString();
            response.should.equal('Thanks for subscribing to our newsletter.');
          })
      );

      // Delete test user
      // after(() =>
      //   User.destroy({
      //     where: {
      //       email: 'nul@bitbucket.com'
      //     }
      //   })
      // );
    });

    describe('POST /api/user/unsubscribe/:email', function() {
      let newSubscriber = {
        email: 'nul@bitbucket.com'
      };

      it('should send response confirming the user was unsubscribed', () =>
        request(app)
          .get(`/api/user/unsubscribe/${newSubscriber.email}`)
          .send(newSubscriber)
          .expect(200)
          .expect('Content-Type', /html/)
          .expect(res => {
            let response = res.text.toString();
            response.should.equal(`Unsubscribed ${newSubscriber.email} from the newsletter.`);
          })
      );

      // Delete test user
      after(() =>
        User.destroy({
          where: {
            email: 'nul@bitbucket.com'
          }
        })
      );
    });
  });
});
