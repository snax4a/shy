import angular from 'angular';
import ngRoute from 'angular-route';
import routes from './home.routes';
import UibCarouselDirective from 'angular-ui-bootstrap/src/carousel/index-nocss.js';
import { HomeService } from './home.service';
import { HomeComponent } from './home.component';

export default angular.module('shyApp.home', [ngRoute, UibCarouselDirective])
  .config(routes)
  .service('HomeService', HomeService)
  .component('home', {
    template: require('./home.pug'),
    controller: HomeComponent
  })
  .name;
