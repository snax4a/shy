'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/teachertraining', {
    template: '<teachertraining></teachertraining>',
    title: 'Pittsburgh Yoga Teacher Training - 200 Hour Program',
    resolve: {
      '': Cart => Cart.initialized
    }
  });
}
