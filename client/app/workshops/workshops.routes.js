'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('workshops', {
      url: '/workshops',
      template: '<workshops></workshops>',
      title: 'Schoolhouse Yoga Workshops'
    });
}
