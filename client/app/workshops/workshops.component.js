'use strict';
import angular from 'angular';
import routes from './workshops.routes';
import uiRouter from 'angular-ui-router';
import workshops from '../../assets/data/workshops.json';

export class WorkshopsController {
  /*@ngInject*/
  constructor($log, $http, $timeout, $window) {
    this.$log = $log;
    this.$http = $http;
    this.$timeout = $timeout;
    this.$window = $window;
    this.subscriber = {};
    this.submitted = false;
    this.subscribed = false;
    this.subscriptionResult = '';
    this.workshops = [];
  }

  $onInit() {
    // Wait for Twitter widgets to load (visual flash - hate it)
    this.$timeout(() => {
      this.$window.twttr.widgets.load();
    }, 50);

    // Load the workshops from the JSON file
    this.workshops = workshops;
  }

  subscribe(form) {
    this.submitted = true;
    if(form.$valid) {
      this.$http
        .post('/api/newsletter', this.subscriber)
        .then(response => { // Could use destructuring here {data} instead but it doesn't read as well
          // Put data onto the page where the Thanks goes
          this.subscriptionResult = response.data;
          this.subscribed = true;
        })
        .catch(response => {
          this.subscriptionResult = `Error subscribing: ${response.err}`;
        });
    }
  }
}

export default angular.module('shyApp.workshops', [uiRouter])
  .config(routes)
  .component('workshops', {
    template: require('./workshops.pug'),
    controller: WorkshopsController
  })
  .name;
