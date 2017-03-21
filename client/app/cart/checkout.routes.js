'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('checkout', {
      url: '/checkout',
      template: '<checkout></checkout>'
    })
    .state('buy', {
      url: '/buy/{productID}',
      template: '',
      controller($state, Cart) {
        'ngInject';
        const productID = $state.params.productID;
        Cart.addItem(productID, false);
        $state.go('checkout');
      }
    });
}
