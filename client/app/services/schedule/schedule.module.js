'use strict';
import angular from 'angular';

import { ScheduleService } from './schedule.service';

export default angular.module('shyApp.schedule', [])
  .service('ScheduleService', ScheduleService)
  .name;
