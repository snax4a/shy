'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('login', {
      url: '/login',
      template: '<login></login>',
      title: 'Schoolhouse Yoga Login'
    })
    .state('logout', {
      url: '/logout?referrer',
      referrer: 'main',
      template: '',
      controller($state, Auth) {
        'ngInject';
        let referrer = $state.params.referrer || $state.current.referrer || 'main';
        Auth.logout();
        $state.go(referrer);
      }
    });
}
