'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './cart.routes';
import cartModule from '../../components/Cart/Cart.module';

export class CartComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('shyApp.cart', [uiRouter, cartModule])
  .config(routes)
  .component('cart', {
    template: require('./cart.pug'),
    controller: CartComponent
  })
  .name;
