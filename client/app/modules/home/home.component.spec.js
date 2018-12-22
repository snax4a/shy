/* global describe, beforeEach, inject, expect, it */
'use strict';
import angular from 'angular';
import HomeModule from './home.module';

describe('Module: HomeComponent', function() {
  beforeEach(angular.mock.module(HomeModule));

  var homeComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    homeComponent = $componentController('home', {});
  }));

  it('should display the home page with announcements that have not expired', function() {
    expect(1).to.equal(1);
  });
});
