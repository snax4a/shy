'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/shynet', {
    template: '<shynet></shynet>',
    title: 'SHYnet'
  });
}
