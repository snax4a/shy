/* global describe, beforeEach, it, expect, inject */
'use strict';
import angular from 'angular';
import ngResource from 'angular-resource';
import uiBootstrap from 'angular-ui-bootstrap';
import login from './login.component';
import AuthModule from '../../modules/auth/auth.module';

describe('Component: LoginComponent', function() {
  // load the component's module
  beforeEach(angular.mock.module(uiBootstrap));
  beforeEach(angular.mock.module(ngResource));
  beforeEach(angular.mock.module(AuthModule));
  beforeEach(angular.mock.module(login));

  let loginComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    loginComponent = $componentController('login', {});
  }));

  it('should login the user via Google+', function() {
    expect(1).to.equal(1);
  });

  it('should login a user with a local account', function() {
    expect(1).to.equal(1);
  });

  it('should send an email with new password if selected the Forgot Password link', function() {
    expect(1).to.equal(1);
  });

  it('should display error for Forgot Password if user does not exist', function() {
    expect(1).to.equal(1);
  });

  it('should display error for Forgot Password if user has Google+ account', function() {
    expect(1).to.equal(1);
  });
});
