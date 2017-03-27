'use strict';
import angular from 'angular';
import routes from './locations.routes';
import uiRouter from 'angular-ui-router';
import locations from '../../assets/data/locations.json';

export class LocationsController {
  /*@ngInject*/
  $onInit() {
    this.locations = locations;
  }
}

export default angular.module('shyApp.locations', [uiRouter])
  .config(routes)
  .component('locations', {
    template: require('./locations.pug'),
    controller: LocationsController
  })
  .name;
