'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/checkout', {
      template: '<checkout></checkout>',
      title: 'Schoolhouse Yoga Checkout'
    })
    .when('/buy/:product', {
      template: '',
      controller($location, $routeParams, Cart) {
        'ngInject';
        Cart.addItem($routeParams.product, false);
        $location.path('/checkout');
      }
    });
}
