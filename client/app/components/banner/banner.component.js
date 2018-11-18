/* eslint no-sync: 0 */
'use strict';

import angular from 'angular';

export class BannerController {
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
    controller: BannerController
  })
  .name;
