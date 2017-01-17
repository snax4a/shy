'use strict';

describe('Directive: compareTo', function() {
  // load the directive's module
  beforeEach(module('shyApp.compareTo'));

  var element,
    scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function($compile) {
    element = angular.element('<compare-to></compare-to>');
    element = $compile(element)(scope);
    expect(element.text()).to.equal('this is the compareTo directive');
  }));
});
