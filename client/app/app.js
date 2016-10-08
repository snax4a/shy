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
//import ngCart from '../modules/ngCartES5';

// Page components
import main from './main/main.component';
import classes from './classes/classes.component';
import workshops from './workshops/workshops.component';
import locations from './locations/locations.component';
import teachers from './teachers/teachers.component';
import cart from './cart/cart.component';
import register from './register/register.component';
import privacy from './privacy/privacy.component';
import terms from './terms/terms.component';

// Filters
import upcoming from '../filters/upcoming/upcoming.filter';
import htmlid from '../filters/htmlid/htmlid.filter';
import daytodate from '../filters/daytodate/daytodate.filter';

// Directives
import tweet from '../directives/tweet/tweet.directive';

import './app.scss';

angular.module('shyApp', [ngCookies, ngResource, ngSanitize, uiRouter, uiBootstrap, navbar, banner, footer,
    main, classes, workshops, locations, teachers, cart, register, privacy, terms, constants, util, upcoming,
    htmlid, daytodate, tweet
  ])
  .config(routeConfig);

angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['shyApp'], {
      strictDi: true
    });
  });
