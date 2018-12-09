/* eslint no-sync:0 */ //Exception for checking admin status
'use strict';

import angular from 'angular';
import ngRoute from 'angular-route';
import routes from './login.routes';
import UibDatepickerPopupDirective from 'angular-ui-bootstrap/src/datepickerPopup/index-nocss.js';
import UibModalDirective from 'angular-ui-bootstrap/src/modal/index-nocss.js';
import GoogleButtonComponent from '../google-button/google-button.component';

export class LoginComponent {
  /*@ngInject*/
  constructor(Auth, $location, $uibModal) {
    this.Auth = Auth;
    this.$location = $location;
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

export default angular.module('shyApp.login', [ngRoute, UibDatepickerPopupDirective, UibModalDirective, GoogleButtonComponent])
  .config(routes)
  .component('login', {
    template: require('./login.pug'),
    controller: LoginComponent
  })
  .name;
