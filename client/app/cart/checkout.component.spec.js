/* global describe, beforeEach, inject, it, expect */
'use strict';
import angular from 'angular';
import checkoutPage from './checkout.component';
import CartModule from '../../components/cartmodule/cart.module';

describe('Component: CheckOutComponent', function() {
  // load the cart module
  beforeEach(angular.mock.module(checkoutPage));
  beforeEach(angular.mock.module(CartModule));

  let CheckOutComponent;
  // Initialize the controller and a mock scope
  beforeEach(inject($componentController => {
    'ngInject';
    CheckOutComponent = $componentController('checkout', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
