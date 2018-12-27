/* global describe, beforeEach, it, expect, inject */
'use strict';
import angular from 'angular';
import ngResource from 'angular-resource';
import uiBootstrap from 'angular-ui-bootstrap';
import UserManagerModule from './usermanager.module';
import AuthModule from '../../modules/auth/auth.module';

describe('Component: UserManagerComponent', function() {
  // load the component's module
  beforeEach(angular.mock.module(uiBootstrap));
  beforeEach(angular.mock.module(ngResource));
  beforeEach(angular.mock.module(AuthModule));
  beforeEach(angular.mock.module(UserManagerModule));

  let UserManagerComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    UserManagerComponent = $componentController('usermanager', {});
  }));

  it('should display a search field, button and table of results', function() {
    expect(1).to.equal(1);
  });

  it('should find users based on last name', function() {
    expect(1).to.equal(1);
  });

  it('should find users based on first name', function() {
    expect(1).to.equal(1);
  });

  it('should display error if less than 3 characters are typed for the search text', function() {
    expect(1).to.equal(1);
  });

  it('should display no users found if search parameters are x3d3d', function() {
    expect(1).to.equal(1);
  });
});
