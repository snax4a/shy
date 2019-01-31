/* global describe, beforeEach, inject, test, expect */
import angular from 'angular';
import weekdayFilter from './weekday.filter';

describe('Filter: weekday', () => {
  // load the filter's module
  beforeEach(angular.mock.module(weekdayFilter));

  // initialize a new instance of the filter before each test
  let weekday;
  beforeEach(inject($filter => {
    weekday = $filter('weekday');
  }));

  test('should return a day of the week given an integer', () => {
    let dayNumber = 4;
    expect(weekday(dayNumber)).toBe('Wednesday');
  });
});
