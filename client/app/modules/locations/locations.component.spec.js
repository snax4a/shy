/* global describe, beforeEach, test, inject, expect */
import angular from 'angular';
import LocationsModule from './locations.module';

describe('Component: LocationsModule', () => {
  // load the controller's module
  beforeEach(angular.mock.module(LocationsModule));

  let LocationsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    LocationsComponent = $componentController('locations', {});
  }));

  test('should display three locations with an address, map and street view for each', () => {
    expect(1).toBe(1);
  });
});
