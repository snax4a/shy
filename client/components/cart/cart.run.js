'use strict';

export function CartRun($rootScope, Cart, ProductList) {
  'ngInject';
  $rootScope.$on('Cart:change', () => {
    Cart.saveToStorage();
  });

  Cart.loadFromStorage();
  ProductList.loadProductsFromJson();
}
