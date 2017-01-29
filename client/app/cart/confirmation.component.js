'use strict';
import angular from 'angular';
import routes from './confirmation.routes';
import uiRouter from 'angular-ui-router';

export class ConfirmationController {
  /*@ngInject*/
  constructor(Cart) {
    // Dependency
    this.Cart = Cart;
  }

  $onInit() {
    this.confirmation = this.Cart.confirmation.transaction;
  }
}

export default angular.module('shyApp.confirmation', [uiRouter])
  .config(routes)
  .component('confirmation', {
    template: require('./confirmation.pug'),
    controller: ConfirmationController
  })
  .name;

