/* global describe, beforeEach, inject, test, expect */
import angular from 'angular';
import htmlId from './htmlid.filter';

describe('Filter: htmlid', () => {
  // load the filter's module
  //beforeEach(module('shyApp.htmlid'));
  beforeEach(angular.mock.module(htmlId));

  // initialize a new instance of the filter before each test
  let htmlid;
  beforeEach(inject($filter => {
    htmlid = $filter('htmlid');
  }));

  test('should return the input without spaces in lowercase', () => {
    let text = 'Big Test';
    expect(htmlid(text)).toBe('bigtest');
  });
});
