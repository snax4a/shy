'use strict';

// angularJS core
import angular from 'angular';
import ngCookies from 'angular-cookies';
import ngMessages from 'angular-messages';
import ngResource from 'angular-resource';
import ngRoute from 'angular-route';
import ngSanitize from 'angular-sanitize'; // read URLs from JSON
import ngAria from 'angular-aria';

// Configuration-related
import constants from './app.constants';
import { routeConfig } from './app.config';

// Modules
import CartModule from './modules/cart/cart.module';
import AuthModule from './modules/auth/auth.module';
// import UtilModule from './modules/util/util.module'; // Loaded by CartModule

// Interceptors
import ngLoadingBar from 'angular-loading-bar';

// Directives
import UibAlertDirective from 'angular-ui-bootstrap/src/alert';
import UibCarouselDirective from 'angular-ui-bootstrap/src/carousel/index-nocss.js';
import UibCollapseDirective from 'angular-ui-bootstrap/src/collapse';
import UibDatepickerPopupDirective from 'angular-ui-bootstrap/src/datepickerPopup/index-nocss.js';
import UibDropDownDirective from 'angular-ui-bootstrap/src/dropdown/index-nocss.js';
import UibModalDirective from 'angular-ui-bootstrap/src/modal/index-nocss.js';
import UibTabsDirective from 'angular-ui-bootstrap/src/tabs';
import PaginationDirective from 'angular-utils-pagination';
import CompareToDirective from './directives/compareto/compareto.directive';

// Filters
import AmPmFilter from './filters/ampm/ampm.filter';
import DayToDateFilter from './filters/daytodate/daytodate.filter';
import HtmlIdFilter from './filters/htmlid/htmlid.filter';
import NoSubsFilter from './filters/nosubs/nosubs.filter';
import TrustedUrlFilter from './filters/trustedurl/trustedurl.filter';
import UpcomingFilter from './filters/upcoming/upcoming.filter';
import WeekdayFilter from './filters/weekday/weekday.filter';

// Sub-page components
import AnnouncementManagerComponent from './components/announcementmanager/announcementmanager.component';
import BannerComponent from './components/banner/banner.component';
import FooterComponent from './components/footer/footer.component';
import GoogleButtonComponent from './components/google-button/google-button.component';
import NavbarComponent from './components/navbar/navbar.component';
import JsonLdComponent from './components/jsonld/jsonld.component';
import ScheduleManagerComponent from './components/schedulemanager/schedulemanager.component';
import TweetComponent from './components/tweet/tweet.component';
import UserManagerComponent from './components/usermanager/usermanager.component';

// Page components
import MainComponent from './components/main/main.component';
import ClassesComponent from './components/classes/classes.component';
import WorkshopsComponent from './components/workshops/workshops.component';
import LocationsComponent from './components/locations/locations.component';
import TeachersComponent from './components/teachers/teachers.component';
import CheckoutComponent from './components/checkout/checkout.component';
import ConfirmationComponent from './components/confirmation/confirmation.component';
import TeacherTrainingComponent from './components/register/register.component';
import PrivacyComponent from './components/privacy/privacy.component';
import TermsComponent from './components/terms/terms.component';
import LoginComponent from './components/login/login.component';
import AdminComponent from './components/admin/admin.component';
import SignupComponent from './components/signup/signup.component';
import ProfileComponent from './components/profile/profile.component';
import ShynetComponent from './components/shynet/shynet.component';

// App-level SASS styling
import './app.scss';

angular.module('shyApp', [
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
  ngLoadingBar,
  constants,
  PaginationDirective,
  CompareToDirective,
  AuthModule,
  // UtilModule, // loaded by AuthModule
  CartModule,
  AnnouncementManagerComponent,
  BannerComponent,
  FooterComponent,
  GoogleButtonComponent,
  JsonLdComponent,
  NavbarComponent,
  ScheduleManagerComponent,
  TweetComponent,
  UserManagerComponent,
  LoginComponent,
  AdminComponent,
  MainComponent,
  ClassesComponent,
  WorkshopsComponent,
  LocationsComponent,
  TeachersComponent,
  CheckoutComponent,
  ConfirmationComponent,
  TeacherTrainingComponent,
  PrivacyComponent,
  TermsComponent,
  SignupComponent,
  ProfileComponent,
  ShynetComponent
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
