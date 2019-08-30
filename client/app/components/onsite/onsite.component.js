import angular from 'angular';
import routes from './onsite.routes';
import ngRoute from 'angular-route';

export class OnsiteComponent {
  /*@ngInject*/
}

export default angular.module('shyApp.onsite', [ngRoute])
  .config(routes)
  .component('onsite', {
    template: require('./onsite.pug'),
    controller: OnsiteComponent
  })
  .name;
