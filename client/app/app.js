'use strict';

// angularJS core
import angular from 'angular';
import ngCookies from 'angular-cookies';
import ngMessages from 'angular-messages';
import ngSanitize from 'angular-sanitize'; // clean faqs on main
import ngResource from 'angular-resource';

// Modules
import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import CartModule from '../components/cartmodule/cart.module';

// Config for module
import { routeConfig } from './app.config';

// Sub-page components
import navbar from '../components/navbar/navbar.component';
import banner from '../components/banner/banner.component';
import footer from '../components/footer/footer.component';
import tweet from '../components/tweet/tweet.component';

// General components
import _Auth from '../components/auth/auth.module';
import account from './account';
import util from '../components/util/util.module';
import constants from './app.constants';
import dirPagination from 'angular-utils-pagination';
import loadingBar from 'angular-loading-bar';

// Page components
import mainPage from './main/main.component';
import classesPage from './classes/classes.component';
import workshopsPage from './workshops/workshops.component';
import locationsPage from './locations/locations.component';
import teachersPage from './teachers/teachers.component';
import cartPage from './cart/checkout.component';
import confirmationPage from './cart/confirmation.component';
import registerPage from './register/register.component';
import privacyPage from './privacy/privacy.component';
import termsPage from './terms/terms.component';
import adminPage from './admin/admin.component';
import signupPage from './signup/signup.component';

// Filters
import upcoming from '../components/upcoming/upcoming.filter';
import htmlid from '../components/htmlid/htmlid.filter';
import daytodate from '../components/daytodate/daytodate.filter';

// Directives used globally
import compareTo from '../components/compareto/compareto.directive';

// SASS styling
import './app.scss';

// Inject everything into shyApp
angular.module('shyApp', [ngCookies, ngResource, ngMessages, ngSanitize, uiRouter, uiBootstrap, _Auth, account, adminPage, navbar, banner, footer,
  mainPage, classesPage, workshopsPage, locationsPage, teachersPage, cartPage, confirmationPage, registerPage, privacyPage, termsPage, signupPage, constants, util, upcoming,
  htmlid, daytodate, tweet, CartModule, dirPagination, loadingBar, compareTo])
  .config(routeConfig)
  .run(($rootScope, $location, Auth) => {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', (event, next) => {
      Auth.isLoggedIn(loggedIn => {
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
      });
    });
  });

// Load shyApp
angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['shyApp'], {
      strictDi: true
    });
  });
