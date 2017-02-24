/* global describe, beforeEach, it, inject, expect */
'use strict';
import angular from 'angular';
import adminPage from './admin.component';
import _Auth from '../../components/auth/auth.module';

describe('Component: AdminComponent', function() {
  // load the controller's module
  beforeEach(angular.mock.module(_Auth));
  beforeEach(angular.mock.module(adminPage));

  let AdminComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject($componentController => {
    AdminComponent = $componentController('admin', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
