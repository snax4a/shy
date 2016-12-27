'use strict';
import angular from 'angular';
import teachersPage from './teachers.component';

describe('Component: TeachersComponent', () => {
  // load the controller's module
  //beforeEach(module('shyApp.teachers'));
  beforeEach(angular.mock.module(teachersPage));

  var TeachersComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject($componentController => {
    TeachersComponent = $componentController('teachers', {});
  }));

  it('should ...', () => {
    expect(1).to.equal(1);
  });
});
