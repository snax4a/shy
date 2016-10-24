'use strict';
import { CartService } from './CartService';

/*@ngInject*/
export function CartFulfillmentLogService($q, $log) {
  this.checkout = () => {
    let deferred = $q.defer();

    $log.info(CartService.toObject());
    deferred.resolve({
      cart: CartService.toObject()
    });

    return deferred.promise;
  };
}
