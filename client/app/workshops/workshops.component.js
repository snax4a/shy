'use strict';
import angular from 'angular';
import routes from './workshops.routes';

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
  }

  $onInit() {
    // Wait for Twitter widgets to load (visual flash - hate it)
    this.$timeout(() => {
      this.$window.twttr.widgets.load();
    }, 50);

    // Load the workshops from the JSON file
    this.$http.get('/assets/data/workshops.json')
      .then(response => {
        this.data = response.data;
      });
  }

  subscribe(form) {
    this.submitted = true;
    if(form.$valid) {
      // Implement a way to save the email address submitted
      this.$http.post('/api/newsletter/subscribe', this.subscriber)
        .success(data => {
          // Put data onto the page where the Thanks goes
          this.subscriptionResult = data;
        })
        .error(err => {
          this.subscriptionResult = err;
          this.$log.error('Error on server subscribing this person', err);
        });
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
