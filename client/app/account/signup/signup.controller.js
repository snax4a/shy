'use strict';

import angular from 'angular';

export default class SignupController {
  user = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    optOut: false
  };
  errors = {};
  submitted = false;

  /*@ngInject*/
  constructor(Auth, $state, $log) {
    this.Auth = Auth;
    this.$state = $state;
    this.$log = $log;
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
          this.$log.error('Error before extracting .data', err.data);
          err = err.data;
          this.errors = {};

          // Update validity of form fields that match the sequelize errors
          if(err.name) {
            angular.forEach(err.fields, (error, field) => {
              form[field].$setValidity('sequelize', false);
              this.errors[field] = err.message;
            });
            this.$log.error(form);
          }
        });
    }
  }
}
