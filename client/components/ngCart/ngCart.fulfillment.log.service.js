'use strict';

/*@ngInject*/
export function NgCartFulfillmentLogService($q, $log, NgCartService) {
  this.checkout = () => {
    var deferred = $q.defer();

    $log.info(NgCartService.toObject());
    deferred.resolve({
      cart: NgCartService.toObject()
    });

    return deferred.promise;
  };
}
