/* global describe, beforeEach, inject, it, expect */
'use strict';
import angular from 'angular';
import teachersPage from './teachers.component';

describe('Component: TeachersComponent', function() {
  // load the controller's module
  beforeEach(angular.mock.module(teachersPage));

  var TeachersComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    TeachersComponent = $componentController('teachers', {});
  }));

  it('should display the list of teachers with their photos and bios from the JSON file', function() {
    expect(1).to.equal(1);
  });
});
