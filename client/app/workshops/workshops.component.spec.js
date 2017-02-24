/* global describe, beforeEach, inject, it, expect */
'use strict';
import angular from 'angular';
import workshopsPage from './workshops.component';

describe('Component: WorkshopsComponent', function() {
  // load the controller's module
  beforeEach(angular.mock.module(workshopsPage));

  var WorkshopsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    WorkshopsComponent = $componentController('workshops', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
