'use strict';

describe('Filter: upcoming', function() {
  // load the filter's module
  beforeEach(module('shyApp.upcoming'));

  // initialize a new instance of the filter before each test
  var upcoming;
  beforeEach(inject(function($filter) {
    upcoming = $filter('upcoming');
  }));

  it('should return the input prefixed with "upcoming filter:"', function() {
    var text = 'angularjs';
    expect(upcoming(text)).to.equal('upcoming filter: ' + text);
  });
});
