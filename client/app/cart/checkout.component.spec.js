/* global describe, beforeEach, inject, it, expect */
'use strict';
import angular from 'angular';
import CartModule from '../../components/cartmodule/cart.module';

describe('Component: CheckOutComponent', () => {
  // load the cart module
  beforeEach(angular.mock.module(CartModule));

  let CheckOutComponent;
  // Initialize the controller and a mock scope
  beforeEach(inject($componentController => {
    'ngInject';
    CheckOutComponent = $componentController('checkout', {});
  }));

  it('should ...', () => {
    expect(1).to.equal(1);
  });
});
