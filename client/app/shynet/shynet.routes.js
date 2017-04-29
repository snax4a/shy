'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('shynet', {
      url: '/shynet',
      template: '<shynet></shynet>',
      title: 'SHYnet'
    });
}
