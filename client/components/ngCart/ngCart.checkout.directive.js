'use strict';

/*@ngInject*/
export function NgCartCheckoutDirective() {
  return {
    restrict: 'E',
    controller: ('ngCart.cart.controller', ['$rootScope', '$scope', 'ngCart.service', 'ngCart.fulfillment.provider', ($rootScope, $scope, ngCart, fulfillmentProvider) => {
      $scope.ngCart = ngCart;

      $scope.checkout = () => {
        fulfillmentProvider.setService($scope.service);
        fulfillmentProvider.setSettings($scope.settings);
        fulfillmentProvider.checkout()
          .success((data, status, headers, config) => {
            $rootScope.$broadcast('ngCart:checkout_succeeded', data);
          })
          .error((data, status, headers, config) => {
            $rootScope.$broadcast('ngCart:checkout_failed', {
              statusCode: status,
              error: data
            });
          });
      };
    }]),
    scope: {
      service: '@',
      settings: '='
    },
    transclude: true,
    templateUrl: (element, attrs) => {
      if(typeof attrs.templateUrl == 'undefined') {
        return 'template/ngCart/checkout.html';
      } else {
        return attrs.templateUrl;
      }
    }
  };
}
