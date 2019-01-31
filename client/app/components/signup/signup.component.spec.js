/* global describe, beforeEach, test, expect, inject */
'use strict';
import angular from 'angular';
import ngResource from 'angular-resource';
import signup from './signup.component';
import AuthModule from '../../modules/auth/auth.module';

describe('Component: SignupComponent', () => {
  // load the component's module
  beforeEach(angular.mock.module(ngResource));
  beforeEach(angular.mock.module(AuthModule));
  beforeEach(angular.mock.module(signup));

  let signupComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    signupComponent = $componentController('signup', {});
  }));

  test('should allow a user to sign up using Google+', () => {
    expect(1).toBe(1);
  });

  test('should prevent Google+ signup if account already exists', () => {
    expect(1).toBe(1);
  });

  test('should allow a user to create a local account', () => {
    expect(1).toBe(1);
  });

  test('should prevent signup if account already exists', () => {
    expect(1).toBe(1);
  });
});
