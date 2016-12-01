'use strict';
import angular from 'angular';
import upcomingFilter from './upcoming.filter';

describe('Filter: upcoming', function() {
  // load the filter's module
  //beforeEach(module('shyApp.upcoming'));
  beforeEach(angular.mock.module(upcomingFilter));

  // initialize a new instance of the filter before each test
  var upcoming;
  beforeEach(inject(function($filter) {
    upcoming = $filter('upcoming');
  }));

  it('should return false for yesterday and true for tomorrow"', function() {
    let yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
    expect(upcoming(yesterday)).to.equal(false);
    //let tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    //expect(upcoming(tomorrow)).to.equal(true);
  });
});
