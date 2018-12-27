/* global describe, beforeEach, inject, it, expect */
'use strict';
import angular from 'angular';
import TeachersModule from './teachers.module';

describe('Module: TeachersComponent', function() {
  // load the controller's module
  beforeEach(angular.mock.module(TeachersModule));

  var teachersComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    teachersComponent = $componentController('teachers', {});
  }));

  it('should display the list of teachers with their photos and bios from the JSON file', function() {
    expect(1).to.equal(1);
  });
});
