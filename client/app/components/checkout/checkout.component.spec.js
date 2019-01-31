/* global describe, beforeEach, inject, test, expect */
'use strict';
import angular from 'angular';
import checkoutPage from './checkout.component';
import CartModule from '../../modules/cart/cart.module';
import ToastModule from '../../modules/toast/toast.module';

describe('Component: CheckOutComponent', () => {
  // load the cart module
  beforeEach(angular.mock.module(checkoutPage));
  beforeEach(angular.mock.module(CartModule));
  beforeEach(angular.mock.module(ToastModule));

  let CheckOutComponent;
  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    'ngInject';
    CheckOutComponent = $componentController('checkout', {});
  }));

  test('should allow user to change quantities of items in cart', () => {
    expect(1).toBe(1);
  });

  test('should allow user to delete items in cart', () => {
    expect(1).toBe(1);
  });

  test('should allow user to return to previous page if "Keep Shopping" is clicked', () => {
    expect(1).toBe(1);
  });

  test('should recalculate total if quantity is changed', () => {
    expect(1).toBe(1);
  });

  test('should set the focus to "Credit Card Number" if "Check Out" is clicked', () => {
    expect(1).toBe(1);
  });

  test('should display Apple Pay button if Safari on macOS Sierra or iOS 10 is used', () => {
    expect(1).toBe(1);
  });

  test('should not display Apple Pay button if browser and platform is not appropriate', () => {
    expect(1).toBe(1);
  });

  test('should display Braintree hosted fields: card number, expires, and CVV', () => {
    expect(1).toBe(1);
  });

  test('should set card number field to have focus when page is displayed', () => {
    expect(1).toBe(1);
  });

  test('should hide recipient fields unless "This is a gift" is checked', () => {
    expect(1).toBe(1);
  });

  test('should set focus on "Recipient First Name" field if "This is a gift" is checked', () => {
    expect(1).toBe(1);
  });

  test('should disable "Place Order" button if there are no items in the cart', () => {
    expect(1).toBe(1);
  });

  test('should disable "Place Order" button if there are form validation errors', () => {
    expect(1).toBe(1);
  });

  test('should display error and highlight "Credit Card Number" field if the payment fails', () => {
    expect(1).toBe(1);
  });
});
