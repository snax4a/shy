'use strict';

import angular from 'angular';
import ngResource from 'angular-resource';
import uiRouter from 'angular-ui-router';
import routes from './profile.routes';
import AuthModule from '../../components/auth/auth.module';
import oauthButtons from '../../components/oauth-buttons/oauth-buttons.directive';

export class ProfileController {
  /*@ngInject*/
  constructor(Auth, $log) {
    this.Auth = Auth;
    this.$log = $log;
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

  update(form) {
    this.submitted = true;
    if(form.$valid) {
      this.Auth.update(this.user)
        .then(() => {
          this.message = 'Profile successfully updated.';
          return;
        })
        .catch(response => {
          this.$log.info('error response', response.data);
          let err = response.data;
          this.errors = {}; // reset to only the latest errors

          // Update validity of form fields that match the database errors
          if(err.name) {
            for(let error of err.errors) {
              form[error.path].$setValidity('database', false);
              this.errors[error.path] = error.message;
            }
          }
          return;
        });
    }
  }
}

export default angular.module('shyApp.profile', [ngResource, uiRouter, AuthModule, oauthButtons])
  .config(routes)
  .component('profile', {
    template: require('./profile.pug'),
    controller: ProfileController
  })
  .name;
