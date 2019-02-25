import angular from 'angular';
import ngRoute from 'angular-route';
import routes from './admin.routes';
import { AdminComponent } from './admin.component';
import UibTabsDirective from 'angular-ui-bootstrap/src/tabs';
import UserManagerModule from '../../modules/usermanager/usermanager.module';
import AnnouncementManagerModule from '../../modules/announcementmanager/announcementmanager.module';
import ScheduleManagerModule from '../../modules/schedulemanager/schedulemanager.module';
import OrderManagerModule from '../../modules/ordermanager/ordermanager.module';
import ProductManagerModule from '../../modules/productmanager/productmanager.module';
import ClassManagerModule from '../../modules/classmanager/classmanager.module';
import WorkshopManagerModule from '../../modules/workshopmanager/workshopmanager.module';
import LocationManagerModule from '../../modules/locationmanager/locationmanager.module';
import DashboardModule from '../../modules/dashboard/dashboard.module';
import { FileService } from '../../services/file.service';

export default angular.module('shyApp.admin', [
  ngRoute, AnnouncementManagerModule, UibTabsDirective,
  UserManagerModule, ScheduleManagerModule, OrderManagerModule,
  ProductManagerModule, ClassManagerModule, WorkshopManagerModule,
  LocationManagerModule, DashboardModule
])
  .service('FileService', FileService)
  .config(routes)
  .component('admin', {
    template: require('./admin.pug'),
    controller: AdminComponent
  })
  .name;
