import angular from 'angular';
import routes from './confirmation.routes';
import ngRoute from 'angular-route';

export class ConfirmationComponent {
  /*@ngInject*/
  constructor(Cart) {
    // Dependency
    this.Cart = Cart;
  }

  $onInit() {
    this.confirmation = this.Cart.confirmation;
  }
}

export default angular.module('shyApp.confirmation', [ngRoute])
  .config(routes)
  .component('confirmation', {
    template: require('./confirmation.pug'),
    controller: ConfirmationComponent
  })
  .name;
