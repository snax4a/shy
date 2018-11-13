'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/shynet', {
    url: '/shynet',
    template: '<shynet></shynet>',
    authenticate: 'teacher',
    title: 'SHYnet'
  });
}
