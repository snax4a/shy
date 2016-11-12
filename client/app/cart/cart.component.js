'use strict';
import angular from 'angular';
import routes from './cart.routes';

export class CartController {
  /*@ngInject*/
  constructor($window, ProductList, Cart) {
    this.$window = $window;
    // These have to be set here and not $onInit()
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
    this.months = [];
    for(let i = 1; i < 13; i++) {
      this.months.push(i);
    }
    this.years = [];
    let currentYear = new Date().getFullYear();
    for(let i = currentYear; i < currentYear + 10; i++) {
      this.years.push(i);
    }
    // Not needed elsewhere so avoid separate JSON file
    this.states = ['AK', 'AL', 'AR', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI',
      'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MH', 'MI', 'MN', 'MO', 'MS',
      'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'PW',
      'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY'];
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
