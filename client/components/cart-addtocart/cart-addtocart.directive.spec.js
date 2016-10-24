'use strict';

describe('Directive: cart-addtocart', function() {
  // load the directive's module and view
  beforeEach(module('shyApp.cartAddToCart'));
  beforeEach(module('components/cart-addtocart/cart-addtocart.html'));

  var element, scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function($compile) {
    element = angular.element('<cart-addtocart></cart-addtocart>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).to.equal('this is the cart-addtocart directive');
  }));
});
