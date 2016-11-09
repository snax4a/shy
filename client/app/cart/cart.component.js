'use strict';
import angular from 'angular';
import routes from './cart.routes';

export class CartController {
  constructor($log, ProductList, Cart) {
    'ngInject';
    this.$log = $log;
    this.products = ProductList.products;
    this.Cart = Cart;
    $log.info(this.Cart.cartItems);
  }
}

export default angular.module('shyApp.cartPage', [])
  .config(routes)
  .component('cart', {
    template: require('./cart.pug'),
    controller: CartController
  })
  .name;
