'use strict';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './account.routes';
import login from './login';
import settings from './settings';
//import signup from './signup';
import oauthButtons from '../../components/oauth-buttons';

export default angular.module('shyApp.account', [uiRouter, login, settings, /*signup,*/ oauthButtons])
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
