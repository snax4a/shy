'use strict';
import angular from 'angular';
import routes from './workshops.routes';
import uiRouter from 'angular-ui-router';
import workshops from '../../assets/data/workshops.json';

export class WorkshopsController {
  /*@ngInject*/
  constructor($log, $http) {
    this.$log = $log;
    this.$http = $http;
  }

  $onInit() {
    this.subscriber = {};

    // Load the workshops from the JSON file
    this.workshops = [];
    this.workshops = workshops;
  }

  // close the alert by deleting the element in the array
  closeAlert(index) {
    this.alerts.splice(index, 1);
  }

  subscribe(form) {
    if(form.$valid) {
      // Post to the server then create an alerts array (undefined, zero or one item) to give user feedback
      this.$http
        .post('/api/newsletter', this.subscriber)
        .then(response => { // Could use destructuring here {data} instead but it doesn't read as well
          this.alerts = [{
            type: 'alert-success',
            message: response.data
          }];
        })
        .catch(response => {
          this.$log.info('Failed', response);
          this.alerts = [{
            type: 'alert-danger',
            message: response.data
          }];
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
