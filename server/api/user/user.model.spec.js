/* global describe, before, beforeEach, afterEach, expect, it */
'use strict';
import { User } from '../../sqldb';

let user;
let buildUser = function() {
  user = User.build({
    provider: 'local',
    firstName: 'John',
    lastName: 'Doe',
    email: 'test@example.com',
    phone: '412-555-1212',
    password: 'password',
    optOut: true
  });
  return user;
};

describe('User Model', function() {
  before(function() {
    // Sync and clear users before testing
    return User.sync().then(function() {
      return User.destroy({ where: { email: 'test@example.com' } });
    });
  });

  // afterAll(function(done) {
  //   done();
  // });

  beforeEach(function() {
    buildUser();
  });

  afterEach(function() {
    return User.destroy({ where: { email: 'test@example.com' } });
  });

  // it('should begin with 4 users seeded', function() {
  //   return expect(User.findAll()).to.eventually.have.length(4);
  // });

  // it('should fail when saving a duplicate user', function() {
  //   return expect(user.save()
  //     .then(function() {
  //       let userDup = genUser();
  //       return userDup.save();
  //     })).to.be.rejected;
  // });

  // describe('#email', function() {
  //   it('should fail when saving without an email', function() {
  //     user.email = '';
  //     return expect(user.save()).to.be.rejected;
  //   });
  // });

  // describe('#password', function() {
  //   beforeEach(function() {
  //     return user.save();
  //   });

  //   it('should authenticate user if valid', function(done) {
  //     expect(user.authenticate('password')).to.be.true;
  //     done();
  //   });

  //   it('should not authenticate user if invalid', function(done) {
  //     expect(user.authenticate('blah')).to.not.be.true;
  //     done();
  //   });

  //   it('should remain the same hash unless the password is updated', function() {
  //     user.firstName = 'John';
  //     return expect(user.save()
  //       .then(function(u) {
  //         u.authenticate('password');
  //       })).to.eventually.be.true;
  //   });
  // });
});
