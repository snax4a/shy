'use strict';
import angular from 'angular';
import registerPage from './register.component';

describe('Component: RegisterComponent', function() {
  // load the controller's module
  //beforeEach(module('shyApp.register'));
  beforeEach(angular.mock.module(registerPage));

  var RegisterComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    RegisterComponent = $componentController('register', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
