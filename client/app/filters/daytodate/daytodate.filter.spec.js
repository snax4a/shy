/* global describe, beforeEach, inject, it, expect */
'use strict';
import angular from 'angular';
import dayToDateFilter from './daytodate.filter';

describe('Filter: daytodate', () => {
  // load the filter's module
  beforeEach(angular.mock.module(dayToDateFilter));

  // initialize a new instance of the filter before each test
  let daytodate;
  beforeEach(inject($filter => {
    daytodate = $filter('daytodate');
  }));

  it('should return a date for the day of the week', () => {
    let dayNumber = 4;
    expect(daytodate(dayNumber)).to.be.an.instanceof(Date);
  });
});
