/* global describe, beforeEach, it, expect, inject */
'use strict';
import angular from 'angular';
import confirmationPage from './confirmation.component';
import CartModule from '../../components/cartmodule/cart.module';

describe('Component: ConfirmationComponent', function() {
  // load the component's module
  beforeEach(angular.mock.module(CartModule));
  beforeEach(angular.mock.module(confirmationPage));

  let ConfirmationComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    ConfirmationComponent = $componentController('confirmation', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});

