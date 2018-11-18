'use strict';
import angular from 'angular';

export class googleButtonComponent {
  /*@ngInject*/
  constructor($window) {
    this.$window = $window;
  }

  loginOauth(provider) {
    this.$window.location.href = `/auth/${provider}`;
  }
}

export default angular.module('shyApp.googleButton', [])
  .component('googleButton', {
    template: require('./google-button.pug'),
    controller: googleButtonComponent
  })
  .name;
