/* eslint max-len:0 */

// AngularJS core
import angular from 'angular';
import ngAnimate from 'angular-animate'; // for angularjs-toaster
import ngCookies from 'angular-cookies'; // auth.service.js, interceptor.service.js
import ngMessages from 'angular-messages'; // announcementeditor.pug, checkout.pug, forgotpassword.pug, contactmodal.pug, profile.pug, scheduleditor.pug, shynet.pug, classadder.pug, historyeditor.pug, usereditor.pug, workshops.pug
import ngResource from 'angular-resource'; // user.service.js
import ngRoute from 'angular-route'; // _index.html, *.routes.js
import ngSanitize from 'angular-sanitize'; // read URLs from JSON
import ngAria from 'angular-aria'; // aria-hidden, aria-labeledby, aria-label, etc.

// 3rd Party extensions
import ngFileUpload from 'ng-file-upload';

// Configuration-related (mostly for routing)
import { appConfig } from './app.config';

// Modules
import ToastModule from './modules/toast/toast.module';
import NavbarModule from './modules/navbar/navbar.module'; // _index.html
import HomeModule from './modules/home/home.module';
import ClassesModule from './modules/classes/classes.module';
import WorkshopsModule from './modules/workshops/workshops.module';
import LocationsModule from './modules/locations/locations.module';
import TeachersModule from './modules/teachers/teachers.module';
import TeacherTrainingModule from './modules/teachertraining/teachertraining.module';
import CartModule from './modules/cart/cart.module';
import AuthModule from './modules/auth/auth.module';
import LoginModule from './modules/login/login.module';
import AdminModule from './modules/admin/admin.module';
import ShynetModule from './modules/shynet/shynet.module';
import UserManagerModule from './modules/usermanager/usermanager.module'; // admin.component.js, shynet.component.js

// Directives
// UI-Bootstrap optional dependencies: ngAnimate (for animations), ngTouch (for swipe)
import UibAlertDirective from 'angular-ui-bootstrap/src/alert'; // usermanager.component.js, workshops.component.js
import UibDatepickerPopupDirective from 'angular-ui-bootstrap/src/datepickerPopup/index-nocss.js'; // announcementmanager.component.js, shynet.component.js, usermanager.component.js
import UibModalDirective from 'angular-ui-bootstrap/src/modal/index-nocss.js'; // announcementmanager.component.js, login.component.js, navbar.component.js, schedulemanager.component.js, shynet.component.js, usermanager.component.js
import CompareToDirective from './directives/compare-to/compare-to.directive'; // profile.component.js, signup.component.js, usermanager.component.js
import JsonTextDirective from './directives/json-text/json-text.directive'; // usereditor.pug, workshopeditor.pug

// Filters
import HtmlIdFilter from './filters/htmlid/htmlid.filter'; // classes.component.js, locations.component.js, teachers.component.js, workshops.component.js

// Sub-page components
import BannerComponent from './components/banner/banner.component'; // _index.html
import FooterComponent from './components/footer/footer.component'; // _index.html
import GoogleButtonComponent from './components/google-button/google-button.component'; // login.component, profile.component.js, signup.component.js

// Page components - lazy-loaded via ngRoute
import CheckoutComponent from './components/checkout/checkout.component';
import ConfirmationComponent from './components/confirmation/confirmation.component';
import PrivacyComponent from './components/privacy/privacy.component';
import TermsComponent from './components/terms/terms.component';
import SignupComponent from './components/signup/signup.component';
import ProfileComponent from './components/profile/profile.component';

// App-level SASS styling
import './app.scss';

angular.module('shyApp', [
  ToastModule,
  ngAnimate,
  ngAria,
  ngCookies,
  ngResource,
  ngRoute,
  ngMessages,
  ngSanitize,
  ngFileUpload,
  HtmlIdFilter,
  UibAlertDirective,
  UibDatepickerPopupDirective,
  UibModalDirective,
  CompareToDirective,
  JsonTextDirective,
  AuthModule,
  LoginModule,
  CartModule,
  NavbarModule,
  HomeModule,
  ClassesModule,
  WorkshopsModule,
  LocationsModule,
  TeachersModule,
  TeacherTrainingModule,
  UserManagerModule,
  AdminModule,
  ShynetModule,
  BannerComponent,
  FooterComponent,
  GoogleButtonComponent,
  CheckoutComponent,
  ConfirmationComponent,
  PrivacyComponent,
  TermsComponent,
  SignupComponent,
  ProfileComponent
])
  .config(appConfig)
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
    // Set page title based on route
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
