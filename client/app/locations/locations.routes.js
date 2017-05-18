'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/locations', {
    template: '<locations></locations>',
    title: 'Schoolhouse Yoga Locations'
  });
}
