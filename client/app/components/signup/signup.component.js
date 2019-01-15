import angular from 'angular';
import ngResource from 'angular-resource';
import ngRoute from 'angular-route';
import routes from './signup.routes';
import AuthModule from '../../modules/auth/auth.module';
import GoogleButtonComponent from '../google-button/google-button.component';
import CompareToDirective from '../../directives/compare-to/compare-to.directive';

export class SignupComponent {
  /*@ngInject*/
  constructor(Auth, $location) {
    this.Auth = Auth;
    this.$location = $location;
  }

  $onInit() {
    this.user = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      passwordNew: '',
      optOut: false
    };
    this.errors = {};
    this.submitted = false;
  }

  register(form) {
    this.submitted = true;
    if(form.$valid) {
      return this.Auth.createUser(this.user)
        .then(() => {
          // Account created, redirect to home
          this.$location.path('/');
        })
        .catch(err => {
          err = err.data;
          this.errors = {}; // reset to only the latest errors

          // Update validity of form fields that match the sequelize errors
          if(err.name) {
            for(let error of err.errors) {
              form[error.path].$setValidity('sequelize', false);
              this.errors[error.path] = error.message;
            }
          }
        });
    }
  }
}

export default angular.module('shyApp.signup', [ngRoute, ngResource, AuthModule, GoogleButtonComponent, CompareToDirective])
  .config(routes)
  .component('signup', {
    template: require('./signup.pug'),
    controller: SignupComponent
  })
  .name;
