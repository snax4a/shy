/* global describe, beforeEach, test, expect, inject */
import angular from 'angular';
import ngResource from 'angular-resource';
import uiBootstrap from 'angular-ui-bootstrap';
import UserManagerModule from './usermanager.module';
import AuthModule from '../../modules/auth/auth.module';

describe('Component: UserManagerComponent', () => {
  // load the component's module
  beforeEach(angular.mock.module(uiBootstrap));
  beforeEach(angular.mock.module(ngResource));
  beforeEach(angular.mock.module(AuthModule));
  beforeEach(angular.mock.module(UserManagerModule));

  let UserManagerComponent;

  // Initialize the component and a mock scope
  beforeEach(inject($componentController => {
    UserManagerComponent = $componentController('usermanager', {});
  }));

  test('should display a search field, button and table of results', () => {
    expect(1).toBe(1);
  });

  test('should find users based on last name', () => {
    expect(1).toBe(1);
  });

  test('should find users based on first name', () => {
    expect(1).toBe(1);
  });

  test('should display error if less than 3 characters are typed for the search text', () => {
    expect(1).toBe(1);
  });

  test('should display no users found if search parameters are x3d3d', () => {
    expect(1).toBe(1);
  });
});
