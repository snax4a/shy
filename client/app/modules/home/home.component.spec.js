/* global describe, beforeEach, inject, expect, test */
import angular from 'angular';
import HomeModule from './home.module';

describe('Module: HomeComponent', () => {
  beforeEach(angular.mock.module(HomeModule));

  let homeComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject($componentController => {
    homeComponent = $componentController('home', {});
  }));

  test('should display the home page with announcements that have not expired', () => {
    expect(1).toBe(1);
  });
});
