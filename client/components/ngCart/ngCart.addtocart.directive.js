'use strict';

/*@ngInject*/
export function NgCartAddToCartDirective(NgCartService) {
  return {
    restrict: 'E',
    controller: 'ngCart.cart.controller',
    scope: {
      id: '@',
      name: '@',
      quantity: '@',
      quantityMax: '@',
      price: '@',
      data: '='
    },
    transclude: true,
    templateUrl: (element, attrs) => {
      if(typeof attrs.templateUrl == 'undefined') {
        return 'template/ngCart/addtocart.html';
      } else {
        return attrs.templateUrl;
      }
    },
    link: (scope, element, attrs) => {
      scope.attrs = attrs;
      scope.inCart = () => NgCartService.getItemById(attrs.id);

      if(scope.inCart()) {
        scope.q = NgCartService.getItemById(attrs.id).getQuantity();
      } else {
        scope.q = parseInt(scope.quantity, 10);
      }

      scope.qtyOpt = [];
      for(var i = 1; i <= scope.quantityMax; i++) {
        scope.qtyOpt.push(i);
      }
    }
  };
}
