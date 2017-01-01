/* global describe, beforeEach, inject, expect, it */
'use strict';
import angular from 'angular';
import main from './main.component';

describe('Component: MainComponent', function() {
  beforeEach(angular.mock.module(main));

  var mainComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    mainComponent = $componentController('main', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
