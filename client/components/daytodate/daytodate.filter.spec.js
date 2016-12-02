'use strict';
import angular from 'angular';
import dayToDateFilter from './daytodate.filter';

describe('Filter: daytodate', function() {
  // load the filter's module
  beforeEach(angular.mock.module(dayToDateFilter));

  // initialize a new instance of the filter before each test
  var daytodate;
  beforeEach(inject(function($filter) {
    daytodate = $filter('daytodate');
  }));

  it('should return a date for the day of the week', function() {
    var text = 'Thursday';
    expect(daytodate(text)).to.be.an.instanceof(Date);
  });
});
