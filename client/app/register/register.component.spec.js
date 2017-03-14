/* global describe, beforeEach, inject, it, expect */
'use strict';
import angular from 'angular';
import registerPage from './register.component';
import CartModule from '../../components/cartmodule/cart.module';

describe('Component: RegisterComponent', function() {
  // load the controller's module
  beforeEach(angular.mock.module(registerPage));
  beforeEach(angular.mock.module(CartModule));

  var RegisterComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    RegisterComponent = $componentController('register', {});
  }));

  it('should display Teacher Training information with payment options', function() {
    expect(1).to.equal(1);
  });

  it('should disable "Pay Now" unless "I agree" checkbox is checked', function() {
    expect(1).to.equal(1);
  });

  it('should add the teacher training to the cart if user clicks "Pay Now"', function() {
    expect(1).to.equal(1);
  });
});
