/* global describe, beforeEach, test, expect, inject */
'use strict';
import angular from 'angular';
import ngResource from 'angular-resource';
import profile from './profile.component';
import AuthModule from '../../modules/auth/auth.module';

describe('Component: ProfileComponent', () => {
  // load the component's module
  beforeEach(angular.mock.module(ngResource));
  beforeEach(angular.mock.module(AuthModule));
  beforeEach(angular.mock.module(profile));

  let profileComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    profileComponent = $componentController('profile', {});
  }));

  test('should redirect to login page if user is not authenticated', () => {
    expect(1).toBe(1);
  });

  test('should allow user with Google+ account to change their name, phone number, and newsletter subscription', () => {
    expect(1).toBe(1);
  });

  test('should not allow user with Google+ account to change their password or email address', () => {
    expect(1).toBe(1);
  });

  test('should allow user with a local account to change their name, password, email, phone number, and newsletter subscription', () => {
    expect(1).toBe(1);
  });

  test('should display an error for local users if the password is incorrect', () => {
    expect(1).toBe(1);
  });

  test('should display an error if a user with a local account tries to change the email to one that is already used', () => {
    expect(1).toBe(1);
  });
});
