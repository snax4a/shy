'use strict';

import angular from 'angular';

import { NgCartConfig } from './ngCart.config';
import { NgCartProvider } from './ngCart.provider';
import { NgCartService } from './ngCart.service';
import { NgCartItemFactory } from './ngCart.item.factory';
import { NgCartStoreService } from './ngCart.store.service';
import { NgCartCartController } from './ngCart.cart.controller';
//import { NgCartAddToCartDirective } from './ngCart.addtocart.directive';
//import { NgCartCartDirective } from './ngCart.cart.directive';
//import { NgCartSummaryDirective } from './ngCart.summary.directive';
//import { NgCartCheckoutDirective } from './ngCart.checkout.directive';
import { NgCartFulfillmentProviderService } from './ngCart.fulfillment.provider.service';
import { NgCartFulfillmentPayPalService } from './ngCart.fulfillment.paypal.service';
import { NgCartFulfillmentLogService } from './ngCart.fulfillment.log.service';
//import { NgCartFulfillmentHttpService } from './ngCart.fulfillment.http.service';

export default angular.module('ngCart', [])
  .run(['$rootScope', 'ngCart.service', 'NgCartItem', 'ngCart.store.service', ($rootScope, ngCart, ngCartItem, store) => {
    $rootScope.$on('ngCart:change', () => {
      ngCart.$save();
    });

    if(angular.isObject(store.get('cart'))) {
      ngCart.$restore(store.get('cart'));
    } else {
      ngCart.init();
    }
  }])
  .provider('$ngCart', NgCartProvider)
  .service('ngCart.service', NgCartService)
  .factory('NgCartItem', NgCartItemFactory)
  .service('ngCart.store.service', NgCartStoreService)
  .controller('ngCart.cart.controller', NgCartCartController)
  .service('ngCart.fulfillment.provider', NgCartFulfillmentProviderService)
  .service('ngCart.fulfillment.paypal', NgCartFulfillmentPayPalService)
  .service('ngCart.fulfillment.log', NgCartFulfillmentLogService)
  .config(NgCartConfig)
  .name;
//  .directive('ngCart.addtocart', NgCartAddToCartDirective)
//  .directive('ngCart.cart', NgCartCartDirective)
//  .directive('ngCart.summary', NgCartSummaryDirective)
//  .directive('ngCart.checkout', NgCartCheckoutDirective)
//  .service('ngCart.fulfillment.http', NgCartFulfillmentHttpService)
