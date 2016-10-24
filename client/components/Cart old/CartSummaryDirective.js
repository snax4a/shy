'use strict';

/*@ngInject*/
export function CartSummaryDirective() {
  return {
    restrict: 'E',
    controller: 'CartController',
    scope: {},
    transclude: true,
    templateUrl: (element, attrs) => {
      if(typeof attrs.templateUrl == 'undefined') {
        return 'template/summary.html';
      } else {
        return attrs.templateUrl;
      }
    }
  };
}
