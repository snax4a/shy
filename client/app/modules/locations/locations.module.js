import angular from 'angular';
import routes from './locations.routes';
import ngRoute from 'angular-route';
import HtmlIdFilter from '../../filters/htmlid/htmlid.filter';
import TrustedUrlFilter from '../../filters/trustedurl/trustedurl.filter';
import { LocationsComponent } from './locations.component';
import { LocationsService } from './locations.service';

export default angular.module('shyApp.locations', [ngRoute, HtmlIdFilter, TrustedUrlFilter])
  .config(routes)
  .service('LocationsService', LocationsService)
  .component('locations', {
    template: require('./locations.pug'),
    controller: LocationsComponent
  })
  .name;
