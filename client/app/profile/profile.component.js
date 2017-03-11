'use strict';

import angular from 'angular';
import ngResource from 'angular-resource';
import uiRouter from 'angular-ui-router';
import routes from './profile.routes';
import AuthModule from '../../components/auth/auth.module';
import oauthButtons from '../../components/oauth-buttons/oauth-buttons.directive';

export class ProfileController {
  /*@ngInject*/
  constructor(User, Auth, $log) {
    this.User = User;
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

  clearServerError(form, fieldName) {
    form[fieldName].$setValidity('server', true);
  }

  update(form) {
    this.$log.info('form', form);
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
          //this.errors = {}; // reset so we can catch server-side errors
          // Update validity of form fields that match the server errors
          if(err.name) {
            for(let error of err.errors) {
              form[error.path].$setValidity('server', false);
              this.errors[error.path] = error.message;
            }
          }
          this.message = '';
          //form.$valid = true; // so we can resubmit
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
