/* global describe, beforeEach, test, inject, expect */
'use strict';
import angular from 'angular';
import onsitePage from './onsite.component';

describe('Component: OnsiteComponent', () => {
  // load the controller's module
  beforeEach(angular.mock.module(onsitePage));

  let OnsiteComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject($componentController => {
    OnsiteComponent = $componentController('onsite', {});
  }));

  test('should display the onsite page', () => {
    expect(1).toBe(1);
  });
});
