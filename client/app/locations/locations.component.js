'use strict';
import angular from 'angular';
import routes from './locations.routes';
import ngRoute from 'angular-route';
import htmlid from '../../components/htmlid/htmlid.filter';
import trustedurl from '../../components/trustedurl/trustedurl.filter';
import locations from '../../assets/data/locations.json';

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

export default angular.module('shyApp.locations', [ngRoute, htmlid, trustedurl])
  .config(routes)
  .component('locations', {
    template: require('./locations.pug'),
    controller: LocationsController
  })
  .name;
