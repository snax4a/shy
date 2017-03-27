/* global describe, beforeEach, inject, it, expect */
'use strict';
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

  it('should return a day of the week given an integer', () => {
    let dayNumber = 4;
    expect(weekday(dayNumber)).to.be.String('Thursday');
  });
});
