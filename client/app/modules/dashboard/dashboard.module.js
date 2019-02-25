import angular from 'angular';
import { DashboardComponent } from './dashboard.component';
import { DashboardService } from '../../services/dashboard.service';
import 'chart.js';
import 'angular-chart.js';

export default angular.module('shyApp.dashboard', ['chart.js'])
  .service('DashboardService', DashboardService)
  .component('dashboard', {
    template: require('./dashboard.pug'),
    controller: DashboardComponent
  })
  .name;
