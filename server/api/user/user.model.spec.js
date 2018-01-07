/* global describe, before, beforeEach, afterEach, it */
'use strict';
import { User } from '../../sqldb';

let user;
let buildUser = () => {
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

describe('User Model', () => {
  before(() => User.sync().then(() => User.destroy({ where: { email: 'test@example.com' } }).then(buildUser)));

  beforeEach(() => {
    buildUser();
  });

  afterEach(() => User.destroy({ where: { email: 'test@example.com' } }));

  it('should begin with 4 users seeded', () => User.findAll().should.eventually.have.length.above(3));

  it('should fail when saving a duplicate user', () => user.save()
    .then(() => {
      let userDup = buildUser();
      return userDup.save();
    }).should.eventually.be.rejected);

  describe('#email', () => {
    it('should fail when saving without an email', () => {
      user.email = '';
      return user.save().should.eventually.be.rejected;
    });
  });

  describe('#password', () => {
    beforeEach(() => user.save());

    it('should authenticate user if valid', () => user.authenticate('password').should.be.true);

    it('should not authenticate user if invalid', () => user.authenticate('blah').should.be.false);

    it('should not authenticate user if password changes', () => {
      user.password = 'something else';
      return user.save()
        .then(u => u.authenticate('password').should.be.false);
    });
  });
});
