/* global describe, beforeEach, it, inject, expect */
'use strict';
import angular from 'angular';
import classesPage from './classes.component';

describe('Component: ClassesComponent', function() {
  // load the controller's module
  beforeEach(angular.mock.module(classesPage));

  let ClassesComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ClassesComponent = $componentController('classes', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
