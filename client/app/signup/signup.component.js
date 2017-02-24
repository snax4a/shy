'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './signup.routes';
import oauthButtons from '../../components/oauth-buttons/oauth-buttons.directive';

export class SignupController {
  /*@ngInject*/
  constructor(Auth, $state, $log) {
    // Dependencies
    this.Auth = Auth;
    this.$state = $state;
    this.$log = $log;
  }

  $onInit() {
    this.user = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      optOut: false
    };
    this.errors = {};
    this.submitted = false;
  }

  register(form) {
    this.submitted = true;

    if(form.$valid) {
      return this.Auth.createUser({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        phone: this.user.phone,
        password: this.user.password,
        optOut: this.user.optOut
      })
        .then(() => {
          // Account created, redirect to home
          this.$state.go('main');
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

export default angular.module('shyApp.signup', [uiRouter, oauthButtons])
  .config(routes)
  .component('signup', {
    template: require('./signup.pug'),
    controller: SignupController
  })
  .name;
