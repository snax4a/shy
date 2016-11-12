'use strict';
import angular from 'angular';
import routes from './cart.routes';

export class CartController {
  /*@ngInject*/
  constructor($window, ProductList, Cart) {
    this.$window = $window;
    this.products = ProductList.products;
    this.Cart = Cart;
  }

  // Starts the binding (works in constructor but better practice to put here)
  $onInit() {
    this.billing = {
      ccExpMonth: 'Month',
      ccExpYear: 'Year',
      state: 'PA',
      recipientState: 'PA'
    };
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
