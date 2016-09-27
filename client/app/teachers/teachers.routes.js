'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('teachers', {
      url: '/teachers',
      template: '<teachers></teachers>'
    });
}
