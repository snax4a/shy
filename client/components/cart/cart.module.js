'use strict';
import angular from 'angular';

//import { CartProvider } from './cart.provider';
//import { CartConfig } from './cart.config';
import { CartRun } from './cart.run';
import { Cart } from './cart.service';
import { ProductList } from './productlist.service';

// Future: include addtocart component here
export default angular.module('shyApp.cart', [])
//  .provider('$Cart', CartProvider)
//  .config(CartConfig)
  .run(CartRun)
  .service('Cart', Cart)
  .service('ProductList', ProductList)
  .name;
