'use strict';
import angular from 'angular';

import { CartRun } from './cart.run';
import { Cart } from './cart.service';
import { ProductList } from './productlist.service';
import { PayNowController } from './paynow.component';

export default angular.module('shyApp.cart', [])
  .run(CartRun)
  .service('Cart', Cart)
  .service('ProductList', ProductList)
  .component('paynow', {
    template: require('./paynow.pug'),
    bindings: { product: '@' },
    controller: PayNowController
  })
  .name;
