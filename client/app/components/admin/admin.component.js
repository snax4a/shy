/* eslint no-sync:0 */
'use strict';
import angular from 'angular';
import ngRoute from 'angular-route';
import routes from './admin.routes';
import UibTabsDirective from 'angular-ui-bootstrap/src/tabs';
import AnnouncementManagerModule from '../../modules/announcementmanager/announcementmanager.module';
import ScheduleManagerComponent from '../schedulemanager/schedulemanager.component';
import UserManagerModule from '../../modules/usermanager/usermanager.module';

export class AdminComponent {
  /*@ngInject*/
}

export default angular.module('shyApp.admin', [ngRoute, AnnouncementManagerModule, UibTabsDirective, ScheduleManagerComponent, UserManagerModule])
  .config(routes)
  .component('admin', {
    template: require('./admin.pug'),
    controller: AdminComponent
  })
  .name;
