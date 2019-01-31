/* global describe, beforeEach, inject, test, expect */
import angular from 'angular';
import upcomingFilter from './upcoming.filter';

describe('Filter: upcoming', () => {
  // load the filter's module
  beforeEach(angular.mock.module(upcomingFilter));

  // initialize a new instance of the filter before each test
  let upcoming;
  beforeEach(inject($filter => {
    upcoming = $filter('upcoming');
  }));

  test('should return empty array when items have a past expiration', () => {
    expect(upcoming([{expires: '2016-10-01T13:00:00.000-04:00'}])).toBe(null);
  });
  test('should return an array of items for when expiration is in the future', () => {
    expect(upcoming([{expires: '2099-10-01T13:00:00.000-04:00'}])).toBe.at.least(1);
  });
});
