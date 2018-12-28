'use strict';

export default function($routeProvider) {
  'ngInject';
  $routeProvider
    .when('/login', {
      template: '<login></login>',
      title: 'Schoolhouse Yoga Login'
    })
    .when('/logout', {
      referrer: '/',
      template: '',
      controller($location, $route, Auth) {
        'ngInject';
        let referrer = $route.current.params.referrer || $route.current.referrer || '/';
        Auth.logout();
        $location.path(referrer);
      }
    });
}
