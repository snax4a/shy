'use strict';

import angular from 'angular';

export function CartRun($rootScope, Cart, CartStore) {
  'ngInject';
  $rootScope.$on('Cart:change', () => {
    Cart.$save();
  });

  if(angular.isObject(CartStore.get('cart'))) {
    Cart.$restore(CartStore.get('cart'));
  } else {
    Cart.init();
  }
}
