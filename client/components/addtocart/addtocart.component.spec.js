'use strict';

describe('Component: addtocart', function() {
  // load the component's module
  beforeEach(module('shyApp.addtocart'));

  var addtocartComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    addtocartComponent = $componentController('addtocart', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
