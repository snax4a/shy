/* global describe, beforeEach, it, expect */
'use strict';

describe('Component: signup', function() {
  // load the component's module
  beforeEach(module('shyApp.signup'));

  var signupComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    signupComponent = $componentController('signup', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
