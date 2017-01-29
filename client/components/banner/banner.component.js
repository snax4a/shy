'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class BannerController {
  constructor(Cart, $log) {
    'ngInject';
    this.Cart = Cart;
    this.$log = $log;
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
