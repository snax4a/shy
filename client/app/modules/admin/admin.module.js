import angular from 'angular';
import ngRoute from 'angular-route';
import routes from './admin.routes';
import { AdminComponent } from './admin.component';
import UibTabsDirective from 'angular-ui-bootstrap/src/tabs';
import AnnouncementManagerModule from '../../modules/announcementmanager/announcementmanager.module';
import ScheduleManagerModule from '../../modules/schedulemanager/schedulemanager.module';
import UserManagerModule from '../../modules/usermanager/usermanager.module';
import ProductManagerModule from '../../modules/productmanager/productmanager.module';
import ClassManagerModule from '../../modules/classmanager/classmanager.module';
import WorkshopManagerModule from '../../modules/workshopmanager/workshopmanager.module';
import LocationManagerModule from '../../modules/locationmanager/locationmanager.module';
import { FileService } from '../../services/file.service';

export default angular.module('shyApp.admin', [
  ngRoute, AnnouncementManagerModule, UibTabsDirective,
  ScheduleManagerModule, UserManagerModule, ProductManagerModule,
  ClassManagerModule, WorkshopManagerModule, LocationManagerModule
])
  .service('FileService', FileService)
  .config(routes)
  .component('admin', {
    template: require('./admin.pug'),
    controller: AdminComponent
  })
  .name;
