'use strict';

describe('Component: TeachersComponent', function() {
  // load the controller's module
  beforeEach(module('shyApp.teachers'));

  var TeachersComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    TeachersComponent = $componentController('teachers', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
