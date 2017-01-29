/* global describe, beforeEach, inject, it, expect */
'use strict';
import angular from 'angular';
import CheckOutComponent from './checkout.component';
import CartModule from '../../components/cartmodule/cart.module';

describe('Component: CheckOutComponent', () => {
  // load the controller's module
  beforeEach(angular.mock.module(CheckOutComponent));
  beforeEach(angular.mock.module(CartModule));

  // Initialize the controller and a mock scope
  beforeEach(inject($componentController => {
    'ngInject';
    CheckOutComponent = $componentController('checkout', {});
  }));

  it('should ...', () => {
    expect(1).to.equal(1);
  });
});
