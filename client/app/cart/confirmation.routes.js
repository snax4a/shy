'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/confirmation', {
    template: '<confirmation></confirmation>',
    title: 'Schoolhouse Yoga Checkout'
  });
}
