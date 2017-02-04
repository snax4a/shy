'use strict';

export default function routes($stateProvider) {
  'ngInject';

  $stateProvider.state('login', {
    url: '/login',
    template: require('./login/login.pug'),
    controller: 'LoginController',
    controllerAs: '$ctrl'
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
    })
    .state('signup', {
      url: '/signup',
      template: require('./signup/signup.pug'),
      controller: 'SignupController',
      controllerAs: '$ctrl'
    })
    .state('settings', {
      url: '/settings',
      template: require('./settings/settings.pug'),
      controller: 'SettingsController',
      controllerAs: '$ctrl',
      authenticate: true
    });
}
