'use strict';
import angular from 'angular';
import routes from './cart.routes';

export class CartController {
  constructor($window, ProductList, Cart) {
    'ngInject';
    this.$window = $window;
    this.products = ProductList.products;
    this.Cart = Cart;
  }

  keepShopping() {
    this.$window.history.back();
  }
}

export default angular.module('shyApp.cartPage', [])
  .config(routes)
  .component('cart', {
    template: require('./cart.pug'),
    controller: CartController
  })
  .name;
