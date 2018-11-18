/* global describe, beforeEach, inject, it, expect */
'use strict';
import angular from 'angular';
import termsPage from './terms.component';

describe('Component: TermsComponent', function() {
  // load the controller's module
  beforeEach(angular.mock.module(termsPage));

  var TermsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    TermsComponent = $componentController('terms', {});
  }));

  it('should display the terms of use for the website', function() {
    expect(1).to.equal(1);
  });
});
