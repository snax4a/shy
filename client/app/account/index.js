'use strict';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './account.routes';
import login from './login';
import oauthButtons from '../../components/oauth-buttons/oauth-buttons.directive';

export default angular.module('shyApp.account', [uiRouter, login, oauthButtons])
  .config(routes)
  .run($rootScope => {
    'ngInject';
    $rootScope.$on('$stateChangeStart', (event, next, nextParams, current) => {
      if(next.name === 'logout' && current && current.name && !current.authenticate) {
        next.referrer = current.name;
      }
    });
  })
  .name;
