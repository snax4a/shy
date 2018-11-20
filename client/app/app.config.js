'use strict';

export function routeConfig($routeProvider, $locationProvider/*, $anchorScrollProvider */) {
  'ngInject';

  $routeProvider.otherwise({
    redirectTo: '/'
  });

  // $anchorScrollProvider.disableAutoScrolling();

  $locationProvider.html5Mode(true);
}
