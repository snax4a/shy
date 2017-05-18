/* eslint no-sync:0 */
'use strict';
import angular from 'angular';
import ngRoute from 'angular-route';
import routes from './admin.routes';
import tabs from 'angular-ui-bootstrap/src/tabs';
import UserManager from '../../components/usermanager/usermanager.component';
import ScheduleManager from '../../components/schedulemanager/schedulemanager.component';
import AnnouncementManager from '../../components/announcementmanager/announcementmanager.component';

export class AdminController {
  /*@ngInject*/
}

export default angular.module('shyApp.admin', [ngRoute, tabs, UserManager, ScheduleManager, AnnouncementManager])
  .config(routes)
  .component('admin', {
    template: require('./admin.pug'),
    controller: AdminController
  })
  .name;
