'use strict';

/*@ngInject*/
export function NgCartCartDirective() {
  return {
    restrict: 'E',
    controller: 'CartController',
    scope: {},
    templateUrl: (element, attrs) => {
      if(typeof attrs.templateUrl == 'undefined') {
        return 'template/ngCart/cart.html';
      } else {
        return attrs.templateUrl;
      }
    },
    link: (scope, element, attrs) => {}
  };
}
