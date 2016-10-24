'use strict';
import angular from 'angular';
import CartService from '../cart/cart.service';

export default angular.module('shyApp.cartAddToCart', [])
  .directive('cart-addtocart', function() {
    return {
      template: require('./cart-addtocart.pug'),
      restrict: 'E',
      controller: $scope => {
        $scope.Cart = CartService;
      },
      scope: {
        id: '@',
        name: '@',
        quantity: '@',
        quantityMax: '@',
        price: '@'
      },
      transclude: true,
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
  })
  .name;
