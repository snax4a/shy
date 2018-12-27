/* global describe, beforeEach, it, inject, expect */
'use strict';
import angular from 'angular';
import ShynetModule from './shynet.module';
import TeachersModule from '../teachers/teachers.module';
import LocationsModule from '../locations/locations.module';
import ClassesModule from '../classes/classes.module';
import modal from 'angular-ui-bootstrap/src/modal/index-nocss.js';

describe('Module: shynet', function() {
  // load the component's module
  beforeEach(angular.mock.module(modal));
  beforeEach(angular.mock.module(ShynetModule));
  beforeEach(angular.mock.module(TeachersModule));
  beforeEach(angular.mock.module(LocationsModule));
  beforeEach(angular.mock.module(ClassesModule));

  let shynetComponent;

  // Initialize the component and a mock scope
  beforeEach(inject(function($componentController) {
    shynetComponent = $componentController('shynet', {});
  }));

  it('should display the SHYnet page', function() {
    expect(1).to.equal(1);
  });
});
