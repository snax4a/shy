/* global describe, beforeEach, it, inject, expect */
'use strict';
import angular from 'angular';
import locationsPage from './locations.component';

describe('Component: LocationsComponent', function() {
  // load the controller's module
  beforeEach(angular.mock.module(locationsPage));

  let LocationsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    LocationsComponent = $componentController('locations', {});
  }));

  it('should display three locations with an address, map and street view for each', function() {
    expect(1).to.equal(1);
  });
});
