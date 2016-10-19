'use strict';
import { CartService } from './CartService';
import { CartController } from './CartController';

/*@ngInject*/
export function CartAddToCartDirective() {
  return {
    restrict: 'E',
    controller: CartController,
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
        return 'template/addtocart.html';
      } else {
        return attrs.templateUrl;
      }
    },
    link: (scope, element, attrs) => {
      scope.attrs = attrs;
      scope.inCart = () => CartService.getItemById(attrs.id);

      if(scope.inCart()) {
        scope.q = CartService.getItemById(attrs.id).getQuantity();
      } else {
        scope.q = parseInt(scope.quantity, 10);
      }

      scope.qtyOpt = [];
      console.log(scope);
      for(var i = 1; i <= scope.quantityMax; i++) {
        scope.qtyOpt.push(i);
      }
    }
  };
}
