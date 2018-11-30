'use strict';

export function routeConfig($routeProvider, $locationProvider/*, $anchorScrollProvider */) {
  'ngInject';

  $routeProvider.otherwise({
    redirectTo: '/'
  });

  // $anchorScrollProvider.disableAutoScrolling();

  // Rely on history.pushState to change urls where supported
  $locationProvider.html5Mode(true);
}
