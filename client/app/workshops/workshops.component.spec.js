'use strict';
import angular from 'angular';
import workshopsPage from './workshops.component';

describe('Component: WorkshopsComponent', () => {
  // load the controller's module
  //beforeEach(module('shyApp.workshops'));
  beforeEach(angular.mock.module(workshopsPage));

  var WorkshopsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject($componentController => {
    WorkshopsComponent = $componentController('workshops', {});
  }));

  it('should ...', () => {
    expect(1).to.equal(1);
  });
});
