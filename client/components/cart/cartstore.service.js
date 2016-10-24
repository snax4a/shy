'use strict';
import angular from 'angular';

/*@ngInject*/
export function CartStoreService($window) {
  return {
    get: key => {
      if($window.localStorage[key]) {
        let cart = angular.fromJson($window.localStorage[key]);
        return JSON.parse(cart);
      }
      return false;
    },
    set: (key, val) => {
      if(val === undefined) {
        $window.localStorage.removeItem(key);
      } else {
        $window.localStorage[key] = angular.toJson(val);
      }
      return $window.localStorage[key];
    }
  };
}

export default angular.module('shyApp.CartStore', [])
  .service('CartStore', CartStoreService)
  .name;
