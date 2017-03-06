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
    // this.user = {
    //   oldPassword: '',
    //   newPassword: '',
    //   confirmPassword: ''
    // };
    // Instead, how about...
    this.user = {};
    this.Auth.getCurrentUser()
      .then(user => {
        angular.copy(user, this.user);
        this.$log.info('this.user', this.user);
      });

    // now we need to add the password fields (or do we really?)

    this.errors = {
      other: undefined
    };

    this.message = '';
    this.submitted = false;
  }

  update(form) {
    this.submitted = true;

    if(form.$valid) {
      // Make a copy of the user to send as the update
      // this.user might not be correct
      this.Auth.update(this.user)
        .then(() => {
          this.message = 'Profile successfully updated.';
        })
        .catch(() => {
          form.password.$setValidity('sequelize', false);
          this.errors.other = 'Incorrect password';
          this.message = '';
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
