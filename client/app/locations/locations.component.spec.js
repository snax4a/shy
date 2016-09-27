'use strict';

describe('Component: LocationsComponent', function() {
  // load the controller's module
  beforeEach(module('shyApp.locations'));

  var LocationsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    LocationsComponent = $componentController('locations', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
