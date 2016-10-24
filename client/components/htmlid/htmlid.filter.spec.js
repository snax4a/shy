'use strict';

describe('Filter: htmlid', function() {
  // load the filter's module
  beforeEach(module('shyApp.htmlid'));

  // initialize a new instance of the filter before each test
  var htmlid;
  beforeEach(inject(function($filter) {
    htmlid = $filter('htmlid');
  }));

  it('should return the input prefixed with "htmlid filter:"', function() {
    var text = 'angularjs';
    expect(htmlid(text)).to.equal('htmlid filter: ' + text);
  });
});
