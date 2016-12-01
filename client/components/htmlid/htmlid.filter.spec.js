'use strict';
import angular from 'angular';
import htmlId from './htmlid.filter';

describe('Filter: htmlid', function() {
  // load the filter's module
  //beforeEach(module('shyApp.htmlid'));
  beforeEach(angular.mock.module(htmlId));

  // initialize a new instance of the filter before each test
  var htmlid;
  beforeEach(inject(function($filter) {
    htmlid = $filter('htmlid');
  }));

  it('should return the input without spaces in lowercase', function() {
    var text = 'Big Test';
    expect(htmlid(text)).to.equal('bigtest');
  });
});
