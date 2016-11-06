'use strict';

export function CartRun($rootScope, Cart) {
  'ngInject';
  $rootScope.$on('Cart:change', () => {
    Cart.saveToStorage();
  });

  Cart.loadFromStorage();
}
