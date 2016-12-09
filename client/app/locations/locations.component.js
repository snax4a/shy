'use strict';
import angular from 'angular';
import routes from './locations.routes';
import uiRouter from 'angular-ui-router';

export class LocationsController {
  /*@ngInject*/
}

export default angular.module('shyApp.locations', [uiRouter])
  .config(routes)
  .component('locations', {
    template: require('./locations.pug'),
    controller: LocationsController
  })
  .name;
