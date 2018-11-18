'use strict';
import angular from 'angular';
import routes from './locations.routes';
import ngRoute from 'angular-route';
import HtmlIdFilter from '../../filters/htmlid/htmlid.filter';
import TrustedUrlFilter from '../../filters/trustedurl/trustedurl.filter';
import locations from '../../../assets/data/locations.json';

export class LocationsController {
  /*@ngInject*/
  // constructor($http) {
  //   this.$http = $http;
  // }

  $onInit() {
    this.locations = locations; // load synchronously or links to locations won't work
    // this.$http.get('/assets/data/locations.json')
    //   .then(response => {
    //     this.locations = response.data;
    //     return null;
    //   });
  }
}

export default angular.module('shyApp.locations', [ngRoute, HtmlIdFilter, TrustedUrlFilter])
  .config(routes)
  .component('locations', {
    template: require('./locations.pug'),
    controller: LocationsController
  })
  .name;
