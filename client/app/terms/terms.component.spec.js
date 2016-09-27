'use strict';

describe('Component: TermsComponent', function() {
  // load the controller's module
  beforeEach(module('shyApp.terms'));

  var TermsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    TermsComponent = $componentController('terms', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
