'use strict';
// snapjay's ngCart ported to ES6, simplified and included without bower
import angular from 'angular';
//import ngStorage from 'ngStorage'; // Replacement for CartStoreService

import { CartProvider } from './cart.provider';
import { CartConfig } from './cart.config';
import { CartRun } from './cart.run';
import { CartService } from './cart.service';
import { CartItemFactory } from './cartitem.factory';
import { CartStoreService } from './cartstore.service';

export default angular.module('shyApp.cart', [])
  .provider('$Cart', CartProvider)
  .config(CartConfig)
  .run(CartRun)
  .service('Cart', CartService)
  .factory('CartItem', CartItemFactory)
  .service('CartStore', CartStoreService)
  .name;
