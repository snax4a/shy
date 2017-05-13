'use strict';
import angular from 'angular';
import routes from './locations.routes';
import uiRouter from 'angular-ui-router';
import htmlid from '../../components/htmlid/htmlid.filter';
import trustedurl from '../../components/trustedurl/trustedurl.filter';

export class LocationsController {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    this.$http.get('/assets/data/locations.json')
      .then(response => {
        this.locations = response.data;
        return null;
      });
  }
}

export default angular.module('shyApp.locations', [uiRouter, htmlid, trustedurl])
  .config(routes)
  .component('locations', {
    template: require('./locations.pug'),
    controller: LocationsController
  })
  .name;
