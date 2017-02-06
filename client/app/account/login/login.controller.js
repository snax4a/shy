/* eslint no-sync:0 */ //Exception for checking admin status
'use strict';

export default class LoginController {
  user = {
    name: '',
    email: '',
    password: ''
  };
  errors = {
    login: undefined
  };
  submitted = false;

  /*@ngInject*/
  constructor(Auth, $state, $log) {
    this.Auth = Auth;
    this.$state = $state;
    this.$log = $log;
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
          this.$state.go('settings');
        })
        .catch(err => {
          this.errors.login = err.message;
        });
    }
  }
}
