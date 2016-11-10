'use strict';
import angular from 'angular';
import routes from './register.routes';

export class RegisterController {
  constructor(Cart) {
    'ngInject';
    this.Cart = Cart;
  }

  register() {
    if(this.agreed) {
      this.Cart.addItem(0);
    }
  }
}

export default angular.module('shyApp.register', [])
  .config(routes)
  .component('register', {
    template: require('./register.pug'),
    controller: RegisterController
  })
  .name;
