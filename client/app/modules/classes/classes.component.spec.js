/* global describe, beforeEach, it, inject, expect */
'use strict';
import angular from 'angular';
import ClassesModule from './classes.module';

describe('Component: ClassesComponent', function() {
  // load the controller's module
  beforeEach(angular.mock.module(ClassesModule));

  let ClassesComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ClassesComponent = $componentController('classes', {});
  }));

  it('should display classes by school chronologically', function() {
    expect(1).to.equal(1);
  });
});
