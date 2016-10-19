'use strict';
import angular from 'angular';
import routes from './cart.routes';
//import uiRouter from 'angular-ui-router';
//import cartModule from '../../components/Cart/Cart.module';

export class CartComponent {
  /*@ngInject*/
  constructor() {
    console.log('CartComponent initiated');
  }
}

export default angular.module('shyApp.cart', [])
  .config(routes)
  .component('cart', {
    template: require('./cart.pug'),
    controller: CartComponent
  })
  .name;
