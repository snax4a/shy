'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class BannerController {
  constructor(Cart) {
    'ngInject';
    this.Cart = Cart;
  }
}

export default angular.module('shyApp.banner', [])
  .component('banner', {
    template: require('./banner.pug'),
    controller: BannerController
  })
  .name;
