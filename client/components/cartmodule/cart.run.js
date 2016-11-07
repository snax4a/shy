'use strict';

export function CartRun($log, Cart, ProductList) {
  'ngInject';

  Cart.loadFromStorage();
  ProductList.loadProductsFromJson();
}
