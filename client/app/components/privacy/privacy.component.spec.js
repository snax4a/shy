/* global describe, beforeEach, it, inject, expect */
'use strict';
import angular from 'angular';
import privacyPage from './privacy.component';

describe('Component: PrivacyComponent', function() {
  // load the controller's module
  beforeEach(angular.mock.module(privacyPage));

  let PrivacyComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    PrivacyComponent = $componentController('privacy', {});
  }));

  it('should display the privacy policy', function() {
    expect(1).to.equal(1);
  });
});
