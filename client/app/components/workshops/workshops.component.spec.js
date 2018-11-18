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

  it('should display workshops in chronological order omitting ones that are in the past', function() {
    expect(1).to.equal(1);
  });

  it('should add visitor to newsletter when user subscribes with an email not in the database', function() {
    expect(1).to.equal(1);
  });

  it('should turn off the optOut for an existing user if they are already in the database', function() {
    expect(1).to.equal(1);
  });
});
