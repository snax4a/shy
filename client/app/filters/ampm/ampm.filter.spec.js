/* global describe, beforeEach, inject, test, expect */
import angular from 'angular';
import ampmFilter from './ampm.filter';

describe('Filter: ampm', () => {
  // load the filter's module
  beforeEach(angular.mock.module(ampmFilter));

  // initialize a new instance of the filter before each test
  let ampm;
  beforeEach(inject($filter => {
    ampm = $filter('ampm');
  }));

  test('should return a date for the day of the week', () => {
    expect(ampm('13:00')).toBe('1:00pm');
  });
});
