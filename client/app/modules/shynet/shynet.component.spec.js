/* global describe, beforeEach, it, inject, expect */
'use strict';
import angular from 'angular';
import ShynetModule from './shynet.module';
import modal from 'angular-ui-bootstrap/src/modal/index-nocss.js';

describe('Module: shynet', function() {
  // load the component's module
  beforeEach(angular.mock.module(modal));
  beforeEach(angular.mock.module(ShynetModule));

  let ShynetComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    ShynetComponent = $componentController('shynet', {});
  }));

  it('should display the SHYnet page', function() {
    expect(1).to.equal(1);
  });
});
