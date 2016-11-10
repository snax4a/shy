'use strict';
import angular from 'angular';

import { CartRun } from './cart.run';
import { Cart } from './cart.service';
import { ProductList } from './productlist.service';
import { AddToCartController } from './addtocart.component';

export default angular.module('shyApp.cart', [])
  .run(CartRun)
  .service('Cart', Cart)
  .service('ProductList', ProductList)
  .component('addtocart', {
    template: require('./addtocart.pug'),
    bindings: { product: '@' },
    controller: AddToCartController
  })
  .name;
