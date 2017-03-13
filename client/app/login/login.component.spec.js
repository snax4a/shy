/* global describe, beforeEach, it, expect, inject */
'use strict';
import angular from 'angular';
import login from './login.component';

describe('Component: LoginComponent', function() {
  // load the component's module
  beforeEach(angular.mock.module(login));

  let loginComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    loginComponent = $componentController('login', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
