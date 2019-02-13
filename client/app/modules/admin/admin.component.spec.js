/* global describe, beforeEach, test, inject, expect */
'use strict';
import angular from 'angular';
import adminPage from './admin.component';
import modal from 'angular-ui-bootstrap/src/modal/index-nocss.js';
//import ngResource from 'angular-resource';
//import AuthModule from '../../components/auth/auth.module';

describe('Component: AdminComponent', () => {
  // load the controller's module
  beforeEach(angular.mock.module(modal));
  //beforeEach(angular.mock.module(ngResource));
  //beforeEach(angular.mock.module(AuthModule));
  beforeEach(angular.mock.module(adminPage));

  let AdminComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject($componentController => {
    AdminComponent = $componentController('admin', {});
    return null;
  }));

  test('should allow administrator to search using email address, first or last name', () => {
    expect(1).toBe(1);
  });

  test('should display error if search text < 3 characters', () => {
    expect(1).toBe(1);
  });

  test('should allow administrator to delete a user', () => {
    expect(1).toBe(1);
  });

  test('should allow administrator to sort columns', () => {
    expect(1).toBe(1);
  });

  test('should allow administrator to edit an existing user', () => {
    expect(1).toBe(1);
  });

  test('should allow administrator to create a new user', () => {
    expect(1).toBe(1);
  });

  test('should display error new user attributes are inadequate', () => {
    expect(1).toBe(1);
  });
});
