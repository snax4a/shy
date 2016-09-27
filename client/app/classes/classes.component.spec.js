'use strict';

describe('Component: ClassesComponent', function() {
  // load the controller's module
  beforeEach(module('shyApp.classes'));

  var ClassesComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ClassesComponent = $componentController('classes', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
