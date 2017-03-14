'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('classes', {
      url: '/classes',
      template: '<classes></classes>',
      title: 'SHY Classes'
    });
}
