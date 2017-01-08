'use strict';
import angular from 'angular';
import routes from './workshops.routes';
import uiRouter from 'angular-ui-router';
import workshops from '../../assets/data/workshops.json';

export class WorkshopsController {
  /*@ngInject*/
  constructor($log, $http, $timeout) {
    this.$log = $log;
    this.$http = $http;
    this.$timeout = $timeout;
  }

  $onInit() {
    this.subscriber = {};

    // Load Twitter script and widgets
    this.twitterLoad();

    // Load the workshops from the JSON file
    this.workshops = workshops;
  }

  twitterLoad() {
    if(window.twttr === undefined) {
      this.twitterLoadScript(document, 'script', 'twitter-wjs');
    } else {
      this.$timeout(() => window.twttr.widgets.load());
    }
  }

  twitterLoadScript(d, s, id) {
    let js;
    let fjs = d.getElementsByTagName(s)[0];
    let t = window.twttr || {};
    if(d.getElementById(id)) return t;
    js = d.createElement(s);
    js.id = id;
    js.src = '//platform.twitter.com/widgets.js';
    fjs.parentNode.insertBefore(js, fjs);
    t._e = [];
    t.ready = f => {
      t._e.push(f);
    };
    return t;
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
