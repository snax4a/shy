'use strict';
import angular from 'angular';
import routes from './cart.routes';

export class CartController {
  constructor(ProductList, Cart) {
    'ngInject';
    this.products = ProductList.products;
    this.Cart = Cart;
  }
}

export default angular.module('shyApp.cartPage', [])
  .config(routes)
  .component('cart', {
    template: require('./cart.pug'),
    controller: CartController
  })
  .name;
