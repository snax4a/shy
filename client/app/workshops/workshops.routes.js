'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/workshops', {
    template: '<workshops></workshops>',
    title: 'Schoolhouse Yoga Workshops'
  });
}
