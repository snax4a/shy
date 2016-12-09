'use strict';
import angular from 'angular';
import routes from './register.routes';
import uiRouter from 'angular-ui-router';

export class RegisterController {
  constructor(Cart) {
    'ngInject';
    this.Cart = Cart;
    this.paymentTerms = '98';
  }

  register() {
    if(this.agreed) {
      this.Cart.addItem(parseInt(this.paymentTerms, 10));
    }
  }
}

export default angular.module('shyApp.register', [uiRouter])
  .config(routes)
  .component('register', {
    template: require('./register.pug'),
    controller: RegisterController
  })
  .name;
