'use strict';
import angular from 'angular';
import routes from './workshops.routes';
import uiRouter from 'angular-ui-router';
import workshops from '../../assets/data/workshops.json';

export class WorkshopsController {
  /*@ngInject*/
  constructor($window, $http, $timeout, $log) {
    this.$window = $window;
    this.$http = $http;
    this.$timeout = $timeout;
    this.$log = $log;
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

  condenseName(name) {
    return name.replace(/[\W_]+/g, '')
    .toLowerCase()
    .substr(0, 20);
  }

  getEvent(workshop, section) {
    return {
      '@context': 'Event',
      name: workshop.title,
      disambiguatingDescription: section.title,
      location: section.location,
      image: `https://www.schoolhouseyoga.com${workshop.photo}`,
      description: workshop.description,
      url: `https://www.schoolhouseyoga.com/workshops#${this.condenseName(workshop.title)}`,
      startDate: section.start,
      endDate: section.expires
    };
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


  setFocus(fieldID) {
    let fieldToGetFocus = this.$window.document.getElementById(fieldID);
    this.$timeout(() => {
      fieldToGetFocus.focus();
    }, 50);
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
          this.alerts = [{
            type: 'alert-danger',
            message: response.data
          }];
        });
    } else this.setFocus('email');
  }
}

export default angular.module('shyApp.workshops', [uiRouter])
  .config(routes)
  .component('workshops', {
    template: require('./workshops.pug'),
    controller: WorkshopsController
  })
  .name;
