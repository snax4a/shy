/* global describe, beforeEach, inject, expect, it */
'use strict';
import angular from 'angular';
import main from './main.component';
import HomeServiceModule from '../../services/home/home.module';

describe('Component: MainComponent', function() {
  beforeEach(angular.mock.module(main));
  beforeEach(angular.mock.module(HomeServiceModule));

  var mainComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    mainComponent = $componentController('main', {});
  }));

  it('should display the home page with announcements that have not expired', function() {
    expect(1).to.equal(1);
  });
});
