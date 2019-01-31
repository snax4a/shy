/* global describe, beforeEach, test, expect, inject */
import angular from 'angular';
import confirmationPage from './confirmation.component';
import CartModule from '../../modules/cart/cart.module';

describe('Component: ConfirmationComponent', () => {
  // load the component's module
  beforeEach(angular.mock.module(CartModule));
  beforeEach(angular.mock.module(confirmationPage));

  let ConfirmationComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    ConfirmationComponent = $componentController('confirmation', {});
  }));

  test('should display an order confirmation if successful', () => {
    expect(1).toBe(1);
  });
});

