/* global describe, beforeEach, it, inject, expect */
'use strict';
import angular from 'angular';
import shynetPage from './shynet.component';

describe('Component: shynet', function() {
  // load the component's module
  beforeEach(angular.mock.module(shynetPage));

  let ShynetComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    ShynetComponent = $componentController('shynet', {});
  }));

  it('should display the SHYnet page', function() {
    expect(1).to.equal(1);
  });
});
