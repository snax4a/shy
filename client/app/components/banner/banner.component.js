import angular from 'angular';

export class BannerComponent {
  constructor(Cart) {
    'ngInject';
    this.Cart = Cart;
  }

  addItem(productID) {
    this.Cart.addItem(productID);
  }
}

export default angular.module('shyApp.banner', [])
  .component('banner', {
    template: require('./banner.pug'),
    controller: BannerComponent
  })
  .name;
