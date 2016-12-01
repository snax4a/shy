'use strict';
import angular from 'angular';
import cartPage from './cart.component';

describe('Component: CartComponent', function() {
  // load the controller's module
  beforeEach(angular.mock.module(cartPage));
  beforeEach(angular.mock.module('stateMock'));

  let CartComponent;
  let $stateProvider;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController, $stateProvider) {
    'ngInject';
    CartComponent = $componentController('cart', {});
  }));

  it('should ...', function() {
    'ngInject';
    expect(1).to.equal(1);
  });
});
