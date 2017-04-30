/* global describe, beforeEach, inject, it, expect */
'use strict';
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

  it('should return empty array when substitute is true', () => {
    expect(nosubs([{ firstName: 'Eva', lastName: 'Houser', substitute: true}])).to.be.empty;
  });
});
