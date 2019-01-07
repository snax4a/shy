import angular from 'angular';
import UibDatepickerPopupDirective from 'angular-ui-bootstrap/src/datepickerPopup/index-nocss.js';
import UibModalDirective from 'angular-ui-bootstrap/src/modal/index-nocss.js';
import { AnnouncementManagerComponent } from './announcementmanager.component';
import { AnnouncementService } from './announcement.service';

export default angular.module('shyApp.announcementmanager', [UibDatepickerPopupDirective, UibModalDirective])
  .service('AnnouncementService', AnnouncementService)
  .component('announcementmanager', {
    template: require('./announcementmanager.pug'),
    controller: AnnouncementManagerComponent
  })
  .name;
