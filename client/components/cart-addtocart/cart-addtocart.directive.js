'use strict';
import angular from 'angular';
import { CartService } from '../cart/cart.service';

export default angular.module('shyApp.cartAddToCart', [])
  .directive('cart-addtocart', function() {
    return {
      restrict: 'E',
      controller: $scope => {
        console.log('Controller for add to cart');
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
      templateUrl: (element, attrs) => {
        console.log('cart-addtocart loading');
        if(typeof attrs.templateUrl == 'undefined') {
          return './cart-addtocart.html';
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
  })
  .name;
