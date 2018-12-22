'use strict';

export default function routes($routeProvider) {
  'ngInject';

  $routeProvider.when('/', {
    template: '<main></main>',
    title: 'Schoolhouse Yoga',
    resolve: {
      '': HomeService => HomeService.initialized
    }
  });
}
