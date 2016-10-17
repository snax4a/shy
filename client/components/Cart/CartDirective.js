'use strict';

/*@ngInject*/
export function CartDirective() {
  return {
    restrict: 'E',
    controller: 'CartController',
    scope: {},
    templateUrl: (element, attrs) => {
      if(typeof attrs.templateUrl == 'undefined') {
        return 'template/cart.html';
      } else {
        return attrs.templateUrl;
      }
    },
    link: (scope, element, attrs) => {}
  };
}
