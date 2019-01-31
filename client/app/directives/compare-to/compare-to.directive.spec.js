/* global describe, beforeEach, inject, test, expect */
'use strict';
import angular from 'angular';
import compareTo from './compare-to.directive';

describe('Directive: compareTo', () => {
  // load the directive's module
  beforeEach(angular.mock.module(compareTo));

  let element;
  let scope;

  beforeEach(inject($rootScope => {
    scope = $rootScope.$new();
  }));

  test('should make hidden element visible', inject($compile => {
    element = angular.element('<compare-to ng-model="foo"></compare-to>');
    element = $compile(element)(scope);
    expect(element.text()).to.equal('');
  }));
});
