import angular from 'angular';
import UibModalDirective from 'angular-ui-bootstrap/src/modal/index-nocss.js';
import { ProductManagerComponent } from './productmanager.component';
import { ProductService } from './product.service';

export default angular.module('shyApp.productmanager', [UibModalDirective])
  .service('ProductService', ProductService)
  .component('productmanager', {
    template: require('./productmanager.pug'),
    controller: ProductManagerComponent
  })
  .name;
