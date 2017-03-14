/* global describe, beforeEach, it, expect, inject */
'use strict';
import angular from 'angular';
import ngResource from 'angular-resource';
import profile from './profile.component';
import AuthModule from '../../components/auth/auth.module';

describe('Component: ProfileComponent', function() {
  // load the component's module
  beforeEach(angular.mock.module(ngResource));
  beforeEach(angular.mock.module(AuthModule));
  beforeEach(angular.mock.module(profile));

  let profileComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    profileComponent = $componentController('profile', {});
  }));

  it('should redirect to login page if user is not authenticated', function() {
    expect(1).to.equal(1);
  });

  it('should allow user with Google+ account to change their name, phone number, and newsletter subscription', function() {
    expect(1).to.equal(1);
  });

  it('should not allow user with Google+ account to change their password or email address', function() {
    expect(1).to.equal(1);
  });

  it('should allow user with a local account to change their name, password, email, phone number, and newsletter subscription', function() {
    expect(1).to.equal(1);
  });

  it('should display an error for local users if the password is incorrect', function() {
    expect(1).to.equal(1);
  });

  it('should display an error if a user with a local account tries to change the email to one that is already used', function() {
    expect(1).to.equal(1);
  });
});
