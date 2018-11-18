'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/privacy', {
    template: '<privacy></privacy>',
    title: 'Schoolhouse Yoga Privacy Policy'
  });
}
