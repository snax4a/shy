'use strict';

/*@ngInject*/
export function NgCartSummaryDirective() {
  return {
    restrict: 'E',
    controller: 'ngCart.cart.controller',
    scope: {},
    transclude: true,
    templateUrl: (element, attrs) => {
      if(typeof attrs.templateUrl == 'undefined') {
        return 'template/ngCart/summary.html';
      } else {
        return attrs.templateUrl;
      }
    }
  };
}
