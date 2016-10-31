'use strict';
import angular from 'angular';
import routes from './cart.routes';

export class CartComponent {
  constructor() {
    console.log('cartPage constructor.');
  }
}

export default angular.module('shyApp.cartPage', [])
  .config(routes)
  .component('cart', {
    template: require('./cart.pug'),
    controller: CartComponent
  })
  .name;
