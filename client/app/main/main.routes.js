'use strict';

export default function routes($routeProvider) {
  'ngInject';

  $routeProvider.when('/', {
    template: '<main></main>',
    title: 'Pittsburgh Yoga: Schoolhouse Yoga Pittsburgh'
  });
}
