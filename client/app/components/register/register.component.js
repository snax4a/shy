'use strict';
import angular from 'angular';
import routes from './register.routes';
import ngRoute from 'angular-route';

export class RegisterComponent {
  constructor(Cart) {
    'ngInject';
    this.Cart = Cart;
  }

  $onInit() {
    this.paymentTerms = '98'; // product ID for teacher training (one-time fee)
  }

  register() {
    if(this.agreed) {
      this.Cart.addItem(parseInt(this.paymentTerms, 10));
    }
  }
}

export default angular.module('shyApp.register', [ngRoute])
  .config(routes)
  .component('register', {
    template: require('./register.pug'),
    controller: RegisterComponent
  })
  .name;
