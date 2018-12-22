'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/classes', {
    template: '<classes></classes>',
    title: 'Schoolhouse Yoga Classes',
    resolve: {
      '': ClassesService => ClassesService.initialized
    }
  });
}
