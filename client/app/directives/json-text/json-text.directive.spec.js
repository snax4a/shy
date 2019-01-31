/* global describe, beforeEach, inject, test, expect */
import angular from 'angular';
import jsonText from './json-text.directive';

describe('Directive: jsonText', () => {
  // load the directive's module
  beforeEach(angular.mock.module(jsonText));

  let element;
  let scope;

  beforeEach(inject($rootScope => {
    scope = $rootScope.$new();
  }));

  test('should convert bound object to JSON and back to object', inject($compile => {
    element = angular.element('<json-text ng-model="foo"></json-text>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('');
  }));
});
