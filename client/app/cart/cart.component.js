'use strict';
import angular from 'angular';
import routes from './cart.routes';

export class CartComponent {
  /*@ngInject*/
  constructor() {
  }
}

export default angular.module('shyApp.cartPage', [])
  .config(routes)
  .component('cart', {
    template: require('./cart.pug'),
    controller: CartComponent
  })
  .name;
