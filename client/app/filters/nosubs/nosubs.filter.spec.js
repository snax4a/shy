/* global describe, beforeEach, inject, test, expect */
import angular from 'angular';
import nosubsFilter from './nosubs.filter';

describe('Filter: nosubs', () => {
  // load the filter's module
  beforeEach(angular.mock.module(nosubsFilter));

  // initialize a new instance of the filter before each test
  let nosubs;
  beforeEach(inject($filter => {
    nosubs = $filter('nosubs');
  }));

  test('should return empty array when substitute is true', () => {
    expect(nosubs([{ firstName: 'Eva', lastName: 'Houser', substitute: true}])).toBe(null);
  });
});
