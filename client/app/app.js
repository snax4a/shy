'use strict';

import angular from 'angular';
import ngMessages from 'angular-messages';

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

// SASS styling
import './app.scss';

// Inject everything into shyApp
angular.module('shyApp', [uiRouter, uiBootstrap, ngMessages, navbar, banner, footer,
  mainPage, classesPage, workshopsPage, locationsPage, teachersPage, cartPage, registerPage, privacyPage, termsPage, constants, util, upcoming,
  htmlid, daytodate, tweet, CartModule])
  .config(routeConfig);

// Load shyApp
angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['shyApp'], {
      strictDi: true
    });
  });
