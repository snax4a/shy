/* global describe, beforeEach, it, inject, expect */
'use strict';
import angular from 'angular';
import adminPage from './admin.component';

describe('Component: ClassesComponent', () => {
  // load the controller's module
  beforeEach(angular.mock.module(adminPage));

  let AdminComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject($componentController => {
    AdminComponent = $componentController('admin', {});
  }));

  it('should ...', () => {
    expect(1).to.equal(1);
  });
});
