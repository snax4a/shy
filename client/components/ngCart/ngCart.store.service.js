'use strict';
import angular from 'angular';

/*@ngInject*/
export function NgCartStoreService($window) {
  return {
    get: key => {
      if($window.localStorage[key]) {
        var cart = angular.fromJson($window.localStorage[key]);
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
