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

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
