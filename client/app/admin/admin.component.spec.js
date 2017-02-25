/* global describe, beforeEach, it, inject, expect */
'use strict';
import angular from 'angular';
import ngResource from 'angular-resource';
import adminPage from './admin.component';
import AuthModule from '../../components/auth/auth.module';
import uiBootstrap from 'angular-ui-bootstrap';

describe('Component: AdminComponent', function() {
  // load the controller's module
  beforeEach(angular.mock.module(uiBootstrap));
  beforeEach(angular.mock.module(ngResource));
  beforeEach(angular.mock.module(AuthModule));
  beforeEach(angular.mock.module(adminPage));

  let AdminComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    AdminComponent = $componentController('admin', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
