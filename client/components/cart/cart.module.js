'use strict';
import angular from 'angular';

import { CartRun } from './cart.run';
import { Cart } from './cart.service';
import { ProductList } from './productlist.service';
import { AddToCartComponent } from './addtocart.component';

// Not sure I need these (may need the provider)
//import { CartProvider } from './cart.provider';
//import { CartConfig } from './cart.config';

export default angular.module('shyApp.cart', [])
//  .provider('$Cart', CartProvider)
//  .config(CartConfig)
  .run(CartRun)
  .service('Cart', Cart)
  .service('ProductList', ProductList)
  .component('addtocart', {
    template: require('./addtocart.pug'),
    bindings: { product: '<' },
    controller: AddToCartComponent
  })
  .name;
