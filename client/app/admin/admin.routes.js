'use strict';

export default function routes($stateProvider) {
  'ngInject';
  $stateProvider.state('admin', {
    url: '/admin',
    template: '<admin></admin>',
    authenticate: 'admin',
    title: 'Schoolhouse Yoga Admin'
  });
}
