'use strict';
import { CartService } from './CartService';

/*@ngInject*/
export function CartFulfillmentHttpService($http) {
  this.checkout = settings => $http.post(settings.url, {data: CartService.toObject(), options: settings.options});
}
