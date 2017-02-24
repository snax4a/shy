/* global describe, beforeEach, it, expect, inject */
'use strict';
import angular from 'angular';
import signup from './signup.component';

describe('Component: SignupComponent', function() {
  // load the component's module
  beforeEach(angular.mock.module(signup));

  let signupComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    signupComponent = $componentController('signup', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
