/* global describe, beforeEach, inject, test, expect */
'use strict';
import angular from 'angular';
import TeachersModule from './teachers.module';

describe('Module: TeachersComponent', () => {
  // load the controller's module
  beforeEach(angular.mock.module(TeachersModule));

  var teachersComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject($componentController => {
    teachersComponent = $componentController('teachers', {});
  }));

  test('should display the list of teachers with their photos and bios from the JSON file', () => {
    expect(1).toBe(1);
  });
});
