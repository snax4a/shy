'use strict';

/*@ngInject*/
export function NgCartCartDirective() {
  return {
    restrict: 'E',
    controller: 'ngCart.cart.controller',
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
