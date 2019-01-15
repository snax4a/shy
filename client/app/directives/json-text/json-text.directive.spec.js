/* global describe, beforeEach, inject, it, expect */
'use strict';
import angular from 'angular';
import jsonText from './json-text.directive';

describe('Directive: jsonText', function() {
  // load the directive's module
  beforeEach(angular.mock.module(jsonText));

  let element;
  let scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should convert bound object to JSON and back to object', inject(function($compile) {
    element = angular.element('<json-text ng-model="foo"></json-text>');
    element = $compile(element)(scope);
    expect(element.text()).to.equal('');
  }));
});
