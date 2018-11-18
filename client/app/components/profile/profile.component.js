'use strict';

import angular from 'angular';
import ngResource from 'angular-resource';
import ngRoute from 'angular-route';
import routes from './profile.routes';
import AuthModule from '../../modules/auth/auth.module';
import GoogleButtonComponent from '../google-button/google-button.component';
import compareTo from '../../directives/compareto/compareto.directive';

export class ProfileController {
  /*@ngInject*/
  constructor(User, Auth) {
    this.User = User;
    this.Auth = Auth;
  }

  $onInit() {
    this.user = {};
    this.Auth.getCurrentUser()
      .then(user => {
        angular.copy(user, this.user);
        return;
      });
    this.message = '';
    this.submitted = false;
    this.errors = {};
  }

  clearServerError(form, fieldName) {
    form[fieldName].$setValidity('server', true);
  }

  update(form) {
    this.submitted = true;
    if(form.$valid) {
      this.User.update(this.user)
        .$promise
        .then(() => {
          this.message = 'Profile successfully updated.';
          return;
        })
        .catch(response => {
          let err = response.data;
          // Update validity of form fields that match the server errors
          if(err.name) {
            for(let error of err.errors) {
              form[error.path].$setValidity('server', false);
              this.errors[error.path] = error.message;
            }
          }
          this.message = '';
          return;
        });
    }
  }
}

export default angular.module('shyApp.profile', [ngResource, ngRoute, AuthModule, GoogleButtonComponent, compareTo])
  .config(routes)
  .component('profile', {
    template: require('./profile.pug'),
    controller: ProfileController
  })
  .name;
