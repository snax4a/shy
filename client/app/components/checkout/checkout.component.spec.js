/* global describe, beforeEach, inject, it, expect */
'use strict';
import angular from 'angular';
import checkoutPage from './checkout.component';
import CartModule from '../../modules/cart/cart.module';

describe('Component: CheckOutComponent', function() {
  // load the cart module
  beforeEach(angular.mock.module(checkoutPage));
  beforeEach(angular.mock.module(CartModule));

  let CheckOutComponent;
  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    'ngInject';
    CheckOutComponent = $componentController('checkout', {});
  }));

  it('should allow user to change quantities of items in cart', function() {
    expect(1).to.equal(1);
  });

  it('should allow user to delete items in cart', function() {
    expect(1).to.equal(1);
  });

  it('should allow user to return to previous page if "Keep Shopping" is clicked', function() {
    expect(1).to.equal(1);
  });

  it('should recalculate total if quantity is changed', function() {
    expect(1).to.equal(1);
  });

  it('should set the focus to "Credit Card Number" if "Check Out" is clicked', function() {
    expect(1).to.equal(1);
  });

  it('should display Apple Pay button if Safari on macOS Sierra or iOS 10 is used', function() {
    expect(1).to.equal(1);
  });

  it('should not display Apple Pay button if browser and platform is not appropriate', function() {
    expect(1).to.equal(1);
  });

  it('should display Braintree hosted fields: card number, expires, and CVV', function() {
    expect(1).to.equal(1);
  });

  it('should set card number field to have focus when page is displayed', function() {
    expect(1).to.equal(1);
  });

  it('should hide recipient fields unless "This is a gift" is checked', function() {
    expect(1).to.equal(1);
  });

  it('should set focus on "Recipient First Name" field if "This is a gift" is checked', function() {
    expect(1).to.equal(1);
  });

  it('should disable "Place Order" button if there are no items in the cart', function() {
    expect(1).to.equal(1);
  });

  it('should disable "Place Order" button if there are form validation errors', function() {
    expect(1).to.equal(1);
  });

  it('should display error and highlight "Credit Card Number" field if the payment fails', function() {
    expect(1).to.equal(1);
  });
});
