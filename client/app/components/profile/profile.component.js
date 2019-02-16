import angular from 'angular';
import ngResource from 'angular-resource';
import ngRoute from 'angular-route';
import routes from './profile.routes';
import AuthModule from '../../modules/auth/auth.module';
import GoogleButtonComponent from '../google-button/google-button.component';
import CompareToDirective from '../../directives/compare-to/compare-to.directive';

export class ProfileComponent {
  /*@ngInject*/
  constructor($window, Auth) {
    this.$window = $window;
    this.authService = Auth;
  }

  $onInit() {
    this.submitted = false;
    this.errors = {};
    this.user = {}; // clear it
    this.authService.getCurrentUser()
      .then(user => {
        this.user = { ...user };
      }); // Don't modify authService.currentUser
  }

  clearServerError(form, fieldName) {
    form[fieldName].$setValidity('server', true);
  }

  update(form) {
    this.submitted = true;
    if(form.$valid) {
      this.authService.update(this.user)
        .then(() => {
          this.$window.history.back();
        }) // go back to where you were
        .catch(response => {
          const { errors } = response.data;
          // Update validity of form fields that match the server errors
          for(let error of errors) {
            form[error.path].$setValidity('server', false);
            this.errors[error.path] = error.message;
          }
          return;
        });
    }
  }
}

export default angular.module('shyApp.profile', [ngRoute, ngResource, AuthModule, GoogleButtonComponent, CompareToDirective])
  .config(routes)
  .component('profile', {
    template: require('./profile.pug'),
    controller: ProfileComponent
  })
  .name;
