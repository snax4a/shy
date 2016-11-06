'use strict';

import angular from 'angular';

// Modules
import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import CartModule from '../components/cart/cart.module';

// Disabled modules
// import ngMessages from 'angular-messages'; // used for validation error messages

import { routeConfig } from './app.config';

// Sub-page components
import navbar from '../components/navbar/navbar.component';
import banner from '../components/banner/banner.component';
import footer from '../components/footer/footer.component';

// General components
import util from '../components/util/util.module';
import constants from './app.constants';

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
import upcoming from '../components/upcoming/upcoming.filter';
import htmlid from '../components/htmlid/htmlid.filter';
import daytodate from '../components/daytodate/daytodate.filter';

// Directives
import tweet from '../components/tweet/tweet.directive';

import './app.scss';

angular.module('shyApp', [uiRouter, uiBootstrap, navbar, banner, footer,
  mainPage, classesPage, workshopsPage, locationsPage, teachersPage, cartPage, registerPage, privacyPage, termsPage, constants, util, upcoming,
  htmlid, daytodate, tweet, CartModule])
  .config(routeConfig);

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['shyApp'], {
      strictDi: true
    });
  });
