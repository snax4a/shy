'use strict';

// AngularJS core
import angular from 'angular';
import ngCookies from 'angular-cookies'; // auth.service.js, interceptor.service.js
import ngMessages from 'angular-messages'; // announcementeditor.pug, checkout.pug, forgotpassword.pug, contactmodal.pug, profile.pug, scheduleditor.pug, shynet.pug, classadder.pug, historyeditor.pug, usereditor.pug, workshops.pug
import ngResource from 'angular-resource'; // user.service.js
import ngRoute from 'angular-route'; // _index.html, *.routes.js
import ngSanitize from 'angular-sanitize'; // read URLs from JSON
import ngAria from 'angular-aria'; // aria-hidden, aria-labeledby, aria-label, etc.

// Configuration-related
import constants from './app.constants';
import { routeConfig } from './app.config';

// Modules
import NavbarModule from './modules/navbar/navbar.module'; // _index.html
import HomeModule from './modules/home/home.module';
import ClassesModule from './modules/classes/classes.module';
import WorkshopsModule from './modules/workshops/workshops.module';
import LocationsModule from './modules/locations/locations.module';
import TeachersModule from './modules/teachers/teachers.module';
import TeacherTrainingModule from './modules/teachertraining/teachertraining.module';
import CartModule from './modules/cart/cart.module';
import AuthModule from './modules/auth/auth.module';
import ShynetModule from './modules/shynet/shynet.module';
import UserManagerModule from './modules/usermanager/usermanager.module'; // admin.component.js, shynet.component.js
import AnnouncementManagerModule from './modules/announcementmanager/announcementmanager.module'; // admin.component.js
import ScheduleManagerModule from './modules/schedulemanager/schedulemanager.module'; // admin.component.js

// Interceptors
//import ngLoadingBar from 'angular-loading-bar';

// Directives
// UI-Bootstrap optional dependencies: ngAnimate (for animations), ngTouch (for swipe)
import UibAlertDirective from 'angular-ui-bootstrap/src/alert'; // usermanager.component.js, workshops.component.js
import UibCarouselDirective from 'angular-ui-bootstrap/src/carousel/index-nocss.js'; // main.component.js
import UibCollapseDirective from 'angular-ui-bootstrap/src/collapse'; // navbar.component.js
import UibDatepickerPopupDirective from 'angular-ui-bootstrap/src/datepickerPopup/index-nocss.js'; // announcementmanager.component.js, shynet.component.js, usermanager.component.js
import UibDropDownDirective from 'angular-ui-bootstrap/src/dropdown/index-nocss.js'; // navbar.component.js
import UibModalDirective from 'angular-ui-bootstrap/src/modal/index-nocss.js'; // announcementmanager.component.js, login.component.js, navbar.component.js, schedulemanager.component.js, shynet.component.js, usermanager.component.js
import UibTabsDirective from 'angular-ui-bootstrap/src/tabs'; // admin.component.js
import PaginationDirective from 'angular-utils-pagination'; // usermanager.component.js
import CompareToDirective from './directives/compareto/compareto.directive'; // profile.component.js, signup.component.js, usermanager.component.js

// Filters
import AmPmFilter from './filters/ampm/ampm.filter'; // classes.component.js, schedulemanager.component.js
import DayToDateFilter from './filters/daytodate/daytodate.filter'; // classes.component.js
import HtmlIdFilter from './filters/htmlid/htmlid.filter'; // classes.component.js, locations.component.js, teachers.component.js, workshops.component.js
import NoSubsFilter from './filters/nosubs/nosubs.filter'; // teachers.component.js
import TrustedUrlFilter from './filters/trustedurl/trustedurl.filter'; // locations.component.js
import UpcomingFilter from './filters/upcoming/upcoming.filter'; // workshops.component.js
import WeekdayFilter from './filters/weekday/weekday.filter'; // schedulemanager.component.js

// Sub-page components
import BannerComponent from './components/banner/banner.component'; // _index.html
import FooterComponent from './components/footer/footer.component'; // _index.html
import GoogleButtonComponent from './components/google-button/google-button.component';
import JsonLdComponent from './components/jsonld/jsonld.component'; // workshops.component.js
import TweetComponent from './components/tweet/tweet.component'; // workshops.component.js

// Page components - lazy-loaded via ngRoute
import CheckoutComponent from './components/checkout/checkout.component';
import ConfirmationComponent from './components/confirmation/confirmation.component';
import PrivacyComponent from './components/privacy/privacy.component';
import TermsComponent from './components/terms/terms.component';
import LoginComponent from './components/login/login.component';
import AdminComponent from './components/admin/admin.component';
import SignupComponent from './components/signup/signup.component';
import ProfileComponent from './components/profile/profile.component';

// App-level SASS styling
import './app.scss';

angular.module('shyApp', [
  // ngLoadingBar,
  ngAria,
  ngCookies,
  ngResource,
  ngRoute,
  ngMessages,
  ngSanitize,
  AmPmFilter,
  DayToDateFilter,
  HtmlIdFilter,
  NoSubsFilter,
  TrustedUrlFilter,
  UpcomingFilter,
  WeekdayFilter,
  UibAlertDirective,
  UibCarouselDirective,
  UibCollapseDirective,
  UibDatepickerPopupDirective,
  UibDropDownDirective,
  UibModalDirective,
  UibTabsDirective,
  constants,
  PaginationDirective,
  CompareToDirective,
  AuthModule,
  CartModule,
  NavbarModule,
  HomeModule,
  ClassesModule,
  WorkshopsModule,
  LocationsModule,
  TeachersModule,
  TeacherTrainingModule,
  UserManagerModule,
  AnnouncementManagerModule,
  ScheduleManagerModule,
  ShynetModule,
  BannerComponent,
  FooterComponent,
  GoogleButtonComponent,
  JsonLdComponent,
  TweetComponent,
  LoginComponent,
  AdminComponent,
  CheckoutComponent,
  ConfirmationComponent,
  PrivacyComponent,
  TermsComponent,
  SignupComponent,
  ProfileComponent
])
  .config(routeConfig)
  /*
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.latencyThreshold = 500;
  }])
  */
  .run(($rootScope, $location, $route, Auth) => {
    'ngInject';
    // Redirect to login if route requires auth and not logged in
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
    });
  });

// Bootstrap AppModule
angular.element(document)
  .ready(() => {
    angular.bootstrap(document, ['shyApp'], {
      strictDi: true
    });
  });
