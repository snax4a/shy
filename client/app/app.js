'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';
import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
// import ngMessages from 'angular-messages';

import {
  routeConfig
} from './app.config';

// Sub-page components
import navbar from '../components/navbar/navbar.component';
import banner from '../components/banner/banner.component';
import footer from '../components/footer/footer.component';

// General components
import util from '../components/util/util.module';
import constants from './app.constants';
import cartModule from '../components/Cart/Cart.module';

// Page components
import mainPage from './main/main.component';
import classesPage from './classes/classes.component';
import workshopsPage from './workshops/workshops.component';
import locationsPage from './locations/locations.component';
import teachersPage from './teachers/teachers.component';
import cartPage from './cart/cart.component';
import registerPage from './register/register.component';
import privacyPage from './privacy/privacy.component';
import termsPage from './terms/terms.component';

// Filters
import upcoming from '../filters/upcoming/upcoming.filter';
import htmlid from '../filters/htmlid/htmlid.filter';
import daytodate from '../filters/daytodate/daytodate.filter';

// Directives
import tweet from '../directives/tweet/tweet.directive';

import './app.scss';

angular.module('shyApp', [ngCookies, ngResource, ngSanitize, uiRouter, uiBootstrap, navbar, banner, footer,
    mainPage, classesPage, workshopsPage, locationsPage, teachersPage, cartPage, registerPage, privacyPage, termsPage, constants, util, upcoming,
    htmlid, daytodate, tweet, cartModule
  ])
  .config(routeConfig);

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['shyApp'], {
      strictDi: true
    });
  });
