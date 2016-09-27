'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './workshops.routes';

export class WorkshopsComponent {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.subscriberEmail = '';
    this.submitted = false;
    this.subscribed = false;
  }

  $onInit() {
    this.$http.get('/assets/data/workshops.json')
      .then(response => {
        this.data = response.data;
      });
  }

  subscribe(form) {
    this.submitted = true;
    if(form.$valid) {
      // Do an $http.put to add a subscriber to Google docs spreadsheet
      console.log('Email is valid. Doing HTTP PUT to server.', this.subscriberEmail);
      this.subscribed = true;
    }
  }
}

export default angular.module('shyApp.workshops', [uiRouter])
  .config(routes)
  .component('workshops', {
    template: require('./workshops.pug'),
    controller: WorkshopsComponent
  })
  .name;
