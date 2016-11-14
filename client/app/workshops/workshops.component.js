'use strict';
import angular from 'angular';
import routes from './workshops.routes';

export class WorkshopsController {
  /*@ngInject*/
  constructor($http, $timeout) {
    this.$http = $http;
    this.$timeout = $timeout;
    this.subscriberEmail = '';
    this.submitted = false;
    this.subscribed = false;
  }

  $onInit() {
    // Wait for Twitter widgets to load
    this.$timeout(function() {
      window.twttr.widgets.load();
    }, 250);
    // Load the workshops from the JSON file
    this.$http.get('/assets/data/workshops.json')
      .then(response => {
        this.data = response.data;
      });
  }

  subscribe(form) {
    this.submitted = true;
    if(form.$valid) {
      // Do an $http.put to add a subscriber to Google docs spreadsheet
      this.$log.info('Email is valid. Doing HTTP PUT to server.', this.subscriberEmail);
      this.subscribed = true;
    }
  }
}

export default angular.module('shyApp.workshops', [])
  .config(routes)
  .component('workshops', {
    template: require('./workshops.pug'),
    controller: WorkshopsController
  })
  .name;
