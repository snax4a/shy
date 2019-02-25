import angular from 'angular';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from '../../services/dashboard.service';

export default angular.module('shyApp.dashboard', [])
  .service('DashboardService', DashboardService)
  .component('dashboard', {
    template: require('./dashboard.pug'),
    controller: DashboardComponent
  })
  .name;
