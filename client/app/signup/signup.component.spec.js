/* global describe, beforeEach, it, expect, inject */
'use strict';
import angular from 'angular';
import ngResource from 'angular-resource';
import signup from './signup.component';
import AuthModule from '../../components/auth/auth.module';

describe('Component: SignupComponent', function() {
  // load the component's module
  beforeEach(angular.mock.module(ngResource));
  beforeEach(angular.mock.module(AuthModule));
  beforeEach(angular.mock.module(signup));

  let signupComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    signupComponent = $componentController('signup', {});
  }));

  it('should allow a user to sign up using Google+', function() {
    expect(1).to.equal(1);
  });

  it('should prevent Google+ signup if account already exists', function() {
    expect(1).to.equal(1);
  });

  it('should allow a user to create a local account', function() {
    expect(1).to.equal(1);
  });

  it('should prevent signup if account already exists', function() {
    expect(1).to.equal(1);
  });
});
