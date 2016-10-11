'use strict';

/*@ngInject*/
export function NgFulfillmentHttpService($http, NgCartService) {
  this.checkout = settings => $http.post(settings.url, {data: NgCartService.toObject(), options: settings.options});
}
