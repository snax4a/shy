import angular from 'angular';
import ngRoute from 'angular-route';
import routes from './shynet.routes';
import UibDatepickerPopupDirective from 'angular-ui-bootstrap/src/datepickerPopup/index-nocss.js';
import UibModalDirective from 'angular-ui-bootstrap/src/modal/index-nocss.js';
import UserManagerModule from '../../modules/usermanager/usermanager.module';
import { SHYnetComponent } from './shynet.component';
import { TeacherService } from '../../services/teacher.service';

export default angular.module('shyApp.shynet', [ngRoute, UibDatepickerPopupDirective, UibModalDirective, UserManagerModule])
  .config(routes)
  .service('TeacherService', TeacherService)
  .component('shynet', {
    template: require('./shynet.pug'),
    controller: SHYnetComponent
  })
  .name;
