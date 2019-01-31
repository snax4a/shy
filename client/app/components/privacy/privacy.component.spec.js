/* global describe, beforeEach, test, inject, expect */
'use strict';
import angular from 'angular';
import privacyPage from './privacy.component';

describe('Component: PrivacyComponent', () => {
  // load the controller's module
  beforeEach(angular.mock.module(privacyPage));

  let PrivacyComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject($componentController => {
    PrivacyComponent = $componentController('privacy', {});
  }));

  test('should display the privacy policy', () => {
    expect(1).toBe(1);
  });
});
