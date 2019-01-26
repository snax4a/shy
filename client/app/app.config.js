export function appConfig($routeProvider, $locationProvider) {
  'ngInject';

  $routeProvider.otherwise({
    redirectTo: '/'
  });

  // Rely on history.pushState to change urls where supported
  $locationProvider.html5Mode(true);
}
