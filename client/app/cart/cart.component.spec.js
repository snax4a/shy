'use strict';
import angular from 'angular';
import cartPage from './cart.component';
import CartModule from '../../components/cartmodule/cart.module';

describe('Component: CartComponent', function() {
  // load the controller's module
  beforeEach(angular.mock.module(cartPage));
  beforeEach(angular.mock.module(CartModule));

  let CartComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    'ngInject';
    CartComponent = $componentController('cart', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
