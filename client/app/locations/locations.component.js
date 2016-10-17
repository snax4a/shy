'use strict';
import angular from 'angular';
import routes from './locations.routes';
//import uiRouter from 'angular-ui-router';

export class LocationsComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('shyApp.locations', [])
  .config(routes)
  .component('locations', {
    template: require('./locations.pug'),
    controller: LocationsComponent
  })
  .name;
