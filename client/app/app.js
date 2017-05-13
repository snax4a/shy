'use strict';

// angularJS core
import angular from 'angular';
import ngCookies from 'angular-cookies';
import ngMessages from 'angular-messages';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize'; // clean faqs on main
import ngAria from 'angular-aria';

// Bootstrap UI elements used widely
import modal from 'angular-ui-bootstrap/src/modal/index-nocss.js';

// General components
import uiRouter from 'angular-ui-router';
import CartModule from '../components/cartmodule/cart.module';

// Config for module
import { routeConfig } from './app.config';

// Loaded by index.html
import banner from '../components/banner/banner.component';
import footer from '../components/footer/footer.component';
import navbar from '../components/navbar/navbar.component';

// General components
import _Auth from '../components/auth/auth.module';
import constants from './app.constants';
import loadingBar from 'angular-loading-bar';
import util from '../components/util/util.module';

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
import loginPage from './login/login.component';
import adminPage from './admin/admin.component';
import signupPage from './signup/signup.component';
import profilePage from './profile/profile.component';
import shyNetPage from './shynet/shynet.component';

// SASS styling
import './app.scss';

// Inject everything into shyApp
angular.module('shyApp', [ngAria, ngCookies, ngResource, ngMessages, ngSanitize, uiRouter,
  modal,
  _Auth, loginPage, adminPage, navbar, banner, footer, mainPage, classesPage,
  workshopsPage, locationsPage, teachersPage, cartPage, confirmationPage, registerPage,
  privacyPage, termsPage, signupPage, profilePage, shyNetPage, constants, util,
  CartModule, loadingBar])
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
    $rootScope.$on('$stateChangeSuccess', (event, toState) => {
      $rootScope.pageTitle = toState.title;
    });
  });

// Load shyApp
angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['shyApp'], {
      strictDi: true
    });
  });
