'use strict';
import angular from 'angular';
import dayToDateFilter from './daytodate.filter';

describe('Filter: daytodate', function() {
  // load the filter's module
  //beforeEach(module('shyApp.daytodate'));
  beforeEach(angular.mock.module(dayToDateFilter));

  // initialize a new instance of the filter before each test
  var daytodate;
  beforeEach(inject(function($filter) {
    daytodate = $filter('daytodate');
  }));

  it('should return the next date for the day of the week', function() {
    var text = 'Friday';
    expect(daytodate(text)).to.equal('Sat, 03 Dec 2016 04:07:19 GMT');
  });
});
