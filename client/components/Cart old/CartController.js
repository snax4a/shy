'use strict';
import { CartService } from './CartService';

/*@ngInject*/
export function CartController($scope) {
  $scope.Cart = CartService;
}
