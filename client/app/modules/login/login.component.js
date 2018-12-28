'use strict';

import { ForgotPasswordController } from './forgotpassword.controller';

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
