'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './locations.routes';

export class LocationsComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('shyApp.locations', [uiRouter])
  .config(routes)
  .component('locations', {
    template: require('./locations.pug'),
    controller: LocationsComponent
  })
  .name;
