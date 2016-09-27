'use strict';

describe('Filter: daytodate', function() {
  // load the filter's module
  beforeEach(module('shyApp.daytodate'));

  // initialize a new instance of the filter before each test
  var daytodate;
  beforeEach(inject(function($filter) {
    daytodate = $filter('daytodate');
  }));

  it('should return the input prefixed with "daytodate filter:"', function() {
    var text = 'angularjs';
    expect(daytodate(text)).to.equal('daytodate filter: ' + text);
  });
});
