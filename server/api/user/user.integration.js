/* globals describe, it, before, after */
'use strict';

import app from '../..';
import { User } from '../../sqldb';
import request from 'supertest';

describe('User API:', () => {
  const email = 'nul@bitbucket.com';
  let token;
  let user; // Set by getUserProfile()

  let password = 'password';
  let newUser = {
    firstName: 'Boaty',
    lastName: 'McBoatface',
    email,
    password,
    phone: '412-555-1212',
    optOut: false
  };

  // Return a new user object with appropriate defaults
  class TestUser {
    constructor(role, firstName, lastName, password) {
      this.role = role || 'student';
      this.firstName = firstName || 'Boaty';
      this.lastName = lastName || 'McBoatface';
      this.email = email;
      this.password = password || 'password';
      this.optOut = false;
      this.phone = '412-555-1212';
      this.provider = 'local';
    }
  }

  // Retrieve the current user
  const getUserProfile = () =>
    request(app)
      .get('/api/users/me')
      .set('authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(res => {
        user = res.body;
      });

  // Delete student test account (if it exists) then sign-up and get token
  const recreateUser = () =>
    User.destroy({ where: { email } })
      .then(() =>
        request(app)
          .post('/api/users')
          .send(newUser)
          .expect(200)
          .expect('Content-Type', /json/)
          .expect(res => {
            token = res.body.token;
          })
      );

  // Only delete the student test account
  const deleteUser = () => User.destroy({ where: { email } });

  describe('Methods for anyone:', () => {
    before(() => recreateUser());
    after(() => deleteUser());

    // Check token from user.controller.js:create (sign-up)
    describe('POST /api/users/', () => {
      it('should return 144 character token to indicate successful sign-up', () =>
        token.should.have.length(144)
      );
    });

    // Check response from user.controller.js:forgotPassword
    describe('POST /api/users/forgotpassword', () => {
      it('should generate a new password and email it to the user', () =>
        request(app)
          .post('/api/users/forgotpassword')
          .send({ email }) // shorthand for email: email
          .expect(200)
          .expect('Content-Type', /html/)
          .expect(res => {
            res.text.should.equal('New password sent.');
          })
      );
    });
  });

  describe('Methods for current user:', () => {
    before(() => recreateUser());
    after(() => deleteUser());

    // user.controller.js:me
    describe('GET /api/users/me', () => {
      it('should respond with a 401 when not authenticated', () =>
        request(app)
          .get('/api/users/me')
          .set('authorization', 'Bearer BOGUS')
          .expect(401)
      );

      it('should respond with student profile with proper defaults when authenticated', () =>
        getUserProfile()
          .then(() => {
            user._id.should.be.above(0);
            user.email.should.equal(email);
            user.role.should.equal('student');
            user.provider.should.equal('local');
            user.optOut.should.be.false;
          })
      );
    });

    // Check response from user.controller.js:update
    describe('PUT /api/users/:id', () => {
      let newPhone = '000-000-0000';
      let newLastName = 'Changed';
      let updatedUser = {
        firstName: newUser.firstName,
        lastName: newLastName,
        email,
        password: newUser.password,
        phone: newPhone,
        optOut: true // flipped from false
      };

      it('should respond with a 401 when not authenticated', () =>
        getUserProfile()
          .then(() =>
            request(app)
              .put(`/api/users/${user._id}`)
              .set('authorization', 'Bearer BOGUS')
              .send(updatedUser)
              .expect(401)
          )
      );

      it('should update the user\'s profile when authenticated', () =>
        getUserProfile()
          .then(() =>
            request(app)
              .put(`/api/users/${user._id}`)
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
                    foundUser.phone.should.equal(updatedUser.phone);
                    foundUser.optOut.should.be.true;
                  });
              })
          )
      ); // it
    }); // describe PUT
  }); // describe methods for current user

  describe('Methods for teachers or admins:', () => {
    // Recreate user, change role to teacher (think about testing for admin, too)
    before(() =>
      recreateUser()
        .then(() => tryAs('admin')) // teacher role seems to be broken right now (address later)
    );
    after(() => deleteUser()); // should be done by DELETE /api/users/:id but here in case of errors

    const tryAs = role =>
      User.findOne({ where: { email } })
        .then(foundUser => {
          foundUser.role = role;
          return foundUser.save();
        });

    //let user;

    // controller.index (teacher or admin)
    describe('GET /api/users/', () => {
      it('should respond with a 401 when not authenticated', () =>
        request(app)
          .get('/api/users?filter=SHY')
          .set('authorization', 'Bearer BOGUS')
          .expect(401)
      );

      it('should respond with a JSON array of users when authenticated', () =>
        request(app)
          .get('/api/users?filter=SHY')
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
    describe('PUT /api/users/:id/admin', () => {
      // let existingUser = {
      //   _id: user._id, // need to define user object
      //   firstName: 'Jane',
      //   lastName: 'Doe',
      //   email: 'test@example.com',
      //   optOut: true,
      //   phone: '412-555-0000',
      //   role: 'student',
      //   provider: 'local'
      // };

      // it('should upsert the user\'s profile when admin is authenticated', () =>
      //   request(app)
      //     .put(`/api/users/${user._id}/admin`) // test user is updating their own profile
      //     .send(newUser)
      //     .set('authorization', `Bearer ${token}`)
      //     .expect(200)
      //     .expect('Content-Type', /json/)
      //     .expect(res => {
      //       console.log('UPSERT response', res);
      //       //let userId = res.body._id.toString();
      //       //userId.should.equal(user._id.toString());
      //     })
      // );

      it('should respond with a 401 when not authenticated', () =>
        request(app)
          .put(`/api/users/${user._id}/admin`)
          .set('authorization', 'Bearer BOGUS')
          .expect(401)
      );
    });

    // controller.addClasses (teacher or admin)

    // controller.addAttendance (teacher or admin)

    // controller.history (teacher or admin)

    // controller.attendanceDelete (teacher or admin)

    // controller.attendanceDelete (admin only)

    // controller.destroy (admin only)
    describe('DELETE /api/users/:id', () => {
      it('should respond with a 401 when not authenticated', () =>
        request(app)
          .delete(`/api/users/${user._id}`)
          .set('authorization', 'Bearer BOGUS')
          .expect(401)
      );

      it('should respond with a result code of 204 to confirm deletion when authenticated', () =>
        request(app)
          .delete(`/api/users/${user._id}`)
          .set('authorization', `Bearer ${token}`)
          .expect(204)
      );
    });
  });
});
