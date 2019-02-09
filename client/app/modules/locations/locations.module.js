import angular from 'angular';
import routes from './locations.routes';
import ngRoute from 'angular-route';
import HtmlIdFilter from '../../filters/htmlid/htmlid.filter';
import TrustedUrlFilter from '../../filters/trustedurl/trustedurl.filter';
import { LocationsComponent } from './locations.component';

export default angular.module('shyApp.locations', [ngRoute, HtmlIdFilter, TrustedUrlFilter])
  .config(routes)
  .component('locations', {
    template: require('./locations.pug'),
    controller: LocationsComponent
  })
  .name;
