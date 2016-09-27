'use strict';

describe('Component: RegisterComponent', function() {
  // load the controller's module
  beforeEach(module('shyApp.register'));

  var RegisterComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    RegisterComponent = $componentController('register', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
