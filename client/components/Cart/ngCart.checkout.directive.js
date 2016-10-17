'use strict';

/*@ngInject*/
export function NgCartCheckoutDirective() {
  return {
    restrict: 'E',
    controller: ('CartController', ['$rootScope', '$scope', 'CartService', 'CartFulfillmentProvider', ($rootScope, $scope, cart, fulfillmentProvider) => {
      $scope.Cart = cart;

      $scope.checkout = () => {
        fulfillmentProvider.setService($scope.service);
        fulfillmentProvider.setSettings($scope.settings);
        fulfillmentProvider.checkout()
          .success((data, status, headers, config) => {
            $rootScope.$broadcast('Cart:checkout_succeeded', data);
          })
          .error((data, status, headers, config) => {
            $rootScope.$broadcast('Cart:checkout_failed', {
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
