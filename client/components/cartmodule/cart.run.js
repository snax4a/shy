'use strict';

export function CartRun(Cart, ProductList) {
  'ngInject';

  Cart.loadFromStorage();
  ProductList.loadProductsFromJson();
}
