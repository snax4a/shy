import angular from 'angular';
import UibModalDirective from 'angular-ui-bootstrap/src/modal/index-nocss.js';
import { OrderManagerComponent } from './ordermanager.component';
import { OrderService } from '../../services/order.service';

export default angular.module('shyApp.ordermanager', [UibModalDirective])
  .service('OrderService', OrderService)
  .component('ordermanager', {
    template: require('./ordermanager.pug'),
    controller: OrderManagerComponent
  })
  .name;
