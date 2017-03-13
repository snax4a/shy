/* eslint no-sync:0 */ //Exception for checking admin status
'use strict';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './login.routes';
import oauthButtons from '../../components/oauth-buttons/oauth-buttons.directive';

export class LoginController {
  /*@ngInject*/
  constructor(Auth, $state, $uibModal) {
    this.Auth = Auth;
    this.$state = $state;
    this.$uibModal = $uibModal;
  }

  $onInit() {
    this.user = {
      name: '',
      email: '',
      password: ''
    };
    this.errors = {
      login: undefined
    };
    this.submitted = false;
  }

  login(form) {
    this.submitted = true;

    if(form.$valid) {
      this.Auth.login({
        email: this.user.email,
        password: this.user.password
      })
        .then(() => {
          // Logged in, redirect to home unless admin
          if(this.Auth.isAdminSync()) {
            return this.$state.go('admin');
          }
          this.$state.go('profile');
        })
        .catch(err => {
          this.errors.login = err.message;
        });
    }
  }

  forgotPassword() {
    let modalDialog = this.$uibModal.open({
      template: require('./forgotpassword.pug'),
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: ForgotPasswordController
    });

    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(() => {
    });
  }
}

export class ForgotPasswordController {
  /*@ngInject*/
  constructor($http, $uibModalInstance) {
    this.$http = $http;
    this.$uibModalInstance = $uibModalInstance;
    this.errors = {};
    this.email = '';
  }

  clearServerError(form, fieldName) {
    form[fieldName].$setValidity('server', true);
  }

  submit(form) {
    return this.$http.post('/api/users/forgotpassword', { email: this.email })
      .then(() => {
        this.$uibModalInstance.close();
        return null;
      })
      .catch(response => {
        let err = response.data;
        this.errors = {};
        // Update validity of form fields that match the server errors
        if(err.name) {
          for(let error of err.errors) {
            form[error.path].$setValidity('server', false);
            this.errors[error.path] = error.message;
          }
        }
        return null;
      }); // $http.post
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel');
  }
}

export default angular.module('shyApp.login', [uiRouter, oauthButtons])
  .config(routes)
  .component('login', {
    template: require('./login.pug'),
    controller: LoginController
  })
  // .run($rootScope => {
  //   'ngInject';
  //   $rootScope.$on('$stateChangeStart', (event, next, nextParams, current) => {
  //     if(next.name === 'logout' && current && current.name && !current.authenticate) {
  //       next.referrer = current.name;
  //     }
  //   });
  // })
  .name;
