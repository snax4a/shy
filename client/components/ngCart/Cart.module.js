'use strict';

import angular from 'angular';

import { CartProvider } from './CartProvider';
import { CartConfig } from './CartConfig';
import { CartService } from './CartService';
import { CartItemFactory } from './CartItemFactory';
import { CartStoreService } from './CartStoreService';
import { CartController } from './CartController';
import { CartFulfillmentProviderService } from './CartFulfillmentProviderService';
import { CartFulfillmentLogService } from './CartFulfillmentLogService';
import { CartFulfillmentHttpService } from './CartFulfillmentHttpService';
//import { NgCartAddToCartDirective } from './ngCart.addtocart.directive';
//import { NgCartCartDirective } from './ngCart.cart.directive';
//import { NgCartSummaryDirective } from './ngCart.summary.directive';
//import { NgCartCheckoutDirective } from './ngCart.checkout.directive';
//import { CartFulfillmentPayPalService } from './CartFulfillmentPayPalService';

export default angular.module('Cart', [])
  .provider('$Cart', CartProvider)
  .config(CartConfig)
  .run(['$rootScope', 'CartService', 'CartStoreService', ($rootScope, cart, store) => {
    $rootScope.$on('Cart:change', () => {
      cart.$save();
    });

    if(angular.isObject(store.get('cart'))) {
      cart.$restore(store.get('cart'));
    } else {
      cart.init();
    }
  }])
  .service('CartService', CartService)
  .factory('CartItemFactory', CartItemFactory)
  .service('CartStoreService', CartStoreService)
  .controller('CartController', CartController)
  .service('CartFulfillmentProviderService', CartFulfillmentProviderService)
  .service('CartFulfillmentLogService', CartFulfillmentLogService)
  .service('CartFulfillmentHttpService', CartFulfillmentHttpService)
  .name;
//  .service('CartFulfillmentPayPalService', CartFulfillmentPayPalService)
//  .directive('ngCart.addtocart', NgCartAddToCartDirective)
//  .directive('ngCart.cart', NgCartCartDirective)
//  .directive('ngCart.summary', NgCartSummaryDirective)
//  .directive('ngCart.checkout', NgCartCheckoutDirective)
