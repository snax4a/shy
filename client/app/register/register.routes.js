'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/register', {
    template: '<register></register>',
    title: 'Pittsburgh Yoga Teacher Training - 200 Hour Program'
  });
}
