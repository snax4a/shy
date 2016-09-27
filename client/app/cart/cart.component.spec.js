'use strict';

describe('Component: CartComponent', function() {
  // load the controller's module
  beforeEach(module('shyApp.cart'));

  var CartComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    CartComponent = $componentController('cart', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
