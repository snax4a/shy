/* global describe, beforeEach, inject, it, expect */
'use strict';
import angular from 'angular';
import compareTo from './compare-to.directive';

describe('Directive: compareTo', function() {
  // load the directive's module
  beforeEach(angular.mock.module(compareTo));

  let element;
  let scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function($compile) {
    element = angular.element('<compare-to ng-model="foo"></compare-to>');
    element = $compile(element)(scope);
    expect(element.text()).to.equal('');
  }));
});
