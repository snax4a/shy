'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/checkout', {
      template: '<checkout></checkout>',
      title: 'Schoolhouse Yoga Checkout',
      resolve: {
        '': Cart => Cart.initialized
      }
    })
    .when('/buy/:product', { // Used by newsletters with links to add products
      template: '',
      controller($location, $routeParams, Cart) {
        'ngInject';
        Cart.addItem($routeParams.product, false);
        $location.path('/checkout');
      }
    });
}
