'use strict';

// angularJS core
import angular from 'angular';
import ngCookies from 'angular-cookies';
import ngMessages from 'angular-messages';
import ngResource from 'angular-resource';
import ngRoute from 'angular-route';
import ngSanitize from 'angular-sanitize'; // clean faqs on main
import ngAria from 'angular-aria';

// Bootstrap UI elements used widely
import modal from 'angular-ui-bootstrap/src/modal/index-nocss.js';

// Config for module
import { routeConfig } from './app.config';

// Modules
import CartModule from './modules/cart/cart.module';
import _Auth from './modules/auth/auth.module';
import util from './modules/util/util.module';

import constants from './app.constants';
import loadingBar from 'angular-loading-bar';

// Sub-page components
import banner from './components/banner/banner.component';
import footer from './components/footer/footer.component';
import navbar from './components/navbar/navbar.component';

// Page components
import mainPage from './components/main/main.component';
import classesPage from './components/classes/classes.component';
import workshopsPage from './components/workshops/workshops.component';
import locationsPage from './components/locations/locations.component';
import teachersPage from './components/teachers/teachers.component';
import cartPage from './components/checkout/checkout.component';
import confirmationPage from './components/confirmation/confirmation.component';
import registerPage from './components/register/register.component';
import privacyPage from './components/privacy/privacy.component';
import termsPage from './components/terms/terms.component';
import loginPage from './components/login/login.component';
import adminPage from './components/admin/admin.component';
import signupPage from './components/signup/signup.component';
import profilePage from './components/profile/profile.component';
import shyNetPage from './components/shynet/shynet.component';

// SASS styling
import './app.scss';

angular.module('shyApp', [
  ngAria,
  ngCookies,
  ngResource,
  ngRoute,
  ngMessages,
  ngSanitize,
  modal,
  _Auth,
  loginPage,
  adminPage,
  navbar,
  banner,
  footer,
  mainPage,
  classesPage,
  workshopsPage,
  locationsPage,
  teachersPage,
  cartPage,
  confirmationPage,
  registerPage,
  privacyPage,
  termsPage,
  signupPage,
  profilePage,
  shyNetPage,
  constants,
  util,
  CartModule,
  loadingBar
])
  .config(routeConfig)
  .run(($rootScope, $location, $route, $anchorScroll, Auth) => {
    'ngInject';
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', (event, next, current) => {
      Auth.isLoggedIn(loggedIn => {
        if(next.authenticate && !loggedIn) {
          $location.path('/login');
        }
        if(next.name === 'logout' && current && current.originalPath && !current.authenticate) {
          next.referrer = current.originalPath;
        }
      });
    });
    // Change the page title based on the route
    $rootScope.$on('$routeChangeSuccess', () => {
      document.title = $route.current.title;
      // if($location.hash()) {
      //   $anchorScroll();
      //   console.log('$anchorScroll() to ', $location.hash());
      // }
    });
  });

// Bootstrap AppModule
angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['shyApp'], {
      strictDi: true
    });
  });
