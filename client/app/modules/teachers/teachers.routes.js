'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/teachers', {
    template: '<teachers></teachers>',
    title: 'Schoolhouse Yoga Teachers',
    resolve: {
      '': TeachersService => TeachersService.initialized
    }
  });
}
