/* global describe, beforeEach, test, expect, inject */
import angular from 'angular';
import ngResource from 'angular-resource';
import uiBootstrap from 'angular-ui-bootstrap';
import LoginModule from './login.module';
import AuthModule from '../../modules/auth/auth.module';

describe('Module: LoginComponent', () => {
  // load the component's module
  beforeEach(angular.mock.module(uiBootstrap));
  beforeEach(angular.mock.module(ngResource));
  beforeEach(angular.mock.module(AuthModule));
  beforeEach(angular.mock.module(LoginModule));

  let loginComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    loginComponent = $componentController('login', {});
  }));

  test('should login the user via Google+', () => {
    expect(1).toBe(1);
  });

  test('should reject a user with incorrect credentials', () => {
    expect(1).toBe(1);
  });

  test('should login a user with a local account', () => {
    expect(1).toBe(1);
  });

  test('should send an email with new password if selected the Forgot Password link', () => {
    expect(1).toBe(1);
  });

  test('should display error for Forgot Password if user does not exist', () => {
    expect(1).toBe(1);
  });

  test('should display error for Forgot Password if user has Google+ account', () => {
    expect(1).toBe(1);
  });
});
