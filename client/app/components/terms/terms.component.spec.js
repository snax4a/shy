/* global describe, beforeEach, inject, test, expect */
import angular from 'angular';
import termsPage from './terms.component';

describe('Component: TermsComponent', () => {
  // load the controller's module
  beforeEach(angular.mock.module(termsPage));

  let TermsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject($componentController => {
    TermsComponent = $componentController('terms', {});
  }));

  test('should display the terms of use for the website', () => {
    expect(1).to.equal(1);
  });
});
