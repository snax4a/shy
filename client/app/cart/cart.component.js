'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './cart.routes';

export class CartComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('shyApp.cart', [uiRouter])
  .config(routes)
  .component('cart', {
    template: require('./cart.pug'),
    controller: CartComponent,
    controllerAs: 'cartCtrl'
  })
  .name;
