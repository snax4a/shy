'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('privacy', {
      url: '/privacy',
      template: '<privacy></privacy>',
      title: 'Schoolhouse Yoga Privacy Policy'
    });
}
