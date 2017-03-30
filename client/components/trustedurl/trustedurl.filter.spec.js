/* global describe, beforeEach, inject, it, expect */
'use strict';
import angular from 'angular';
import trustedurlFilter from './trustedurl.filter';

describe('Filter: trustedurl', () => {
  // load the filter's module
  beforeEach(angular.mock.module(trustedurlFilter));

  // initialize a new instance of the filter before each test
  let trustedurl;
  beforeEach(inject($filter => {
    trustedurl = $filter('trustedurl');
  }));

  it('should return a TrustedValueHolderType', () => {
    let url = 'https://www.google.com';
    expect(trustedurl(url)).to.be.an('object');
  });
});
