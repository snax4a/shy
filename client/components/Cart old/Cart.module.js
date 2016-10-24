'use strict';

// snapjay's ngCart ported to ES6 and included without bower
import angular from 'angular';

import { CartProvider } from './CartProvider';
import { CartConfig } from './CartConfig';
import { CartController } from './CartController';
import { CartFulfillmentProviderService } from './CartFulfillmentProviderService';
import { CartFulfillmentLogService } from './CartFulfillmentLogService';
import { CartFulfillmentHttpService } from './CartFulfillmentHttpService';
import { CartDirective } from './CartDirective';
import { CartSummaryDirective } from './CartSummaryDirective';
import { CartCheckoutDirective } from './CartCheckoutDirective';
import { CartFulfillmentPayPalService } from './CartFulfillmentPayPalService';

export default angular.module('shyApp.cartModule', [])
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
  .controller('CartController', CartController)
  .service('CartFulfillmentProviderService', CartFulfillmentProviderService)
  .service('CartFulfillmentLogService', CartFulfillmentLogService)
  .service('CartFulfillmentHttpService', CartFulfillmentHttpService)
  .service('CartFulfillmentPayPalService', CartFulfillmentPayPalService)
  .directive('cart-editor', CartDirective)
  .directive('cart-summary', CartSummaryDirective)
  .directive('cart-checkout', CartCheckoutDirective)
  .name;
