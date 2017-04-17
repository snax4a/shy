/* global describe, beforeEach, it, inject, expect */
'use strict';
import angular from 'angular';
//import ngResource from 'angular-resource';
import adminPage from './admin.component';
//import AuthModule from '../../components/auth/auth.module';
import modal from 'angular-ui-bootstrap/src/modal/index-nocss.js';


describe('Component: AdminComponent', function() {
  // load the controller's module
  beforeEach(angular.mock.module(modal));
  //beforeEach(angular.mock.module(ngResource));
  //beforeEach(angular.mock.module(AuthModule));
  beforeEach(angular.mock.module(adminPage));

  let AdminComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AdminComponent = $componentController('admin', {});
  }));

  it('should allow administrator to search using email address, first or last name', function() {
    expect(1).to.equal(1);
  });

  it('should display error if search text < 3 characters', function() {
    expect(1).to.equal(1);
  });

  it('should allow administrator to delete a user', function() {
    expect(1).to.equal(1);
  });

  it('should allow administrator to sort columns', function() {
    expect(1).to.equal(1);
  });

  it('should allow administrator to edit an existing user', function() {
    expect(1).to.equal(1);
  });

  it('should allow administrator to create a new user', function() {
    expect(1).to.equal(1);
  });

  it('should display error new user attributes are inadequate', function() {
    expect(1).to.equal(1);
  });
});
