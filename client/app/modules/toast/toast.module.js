import angular from 'angular';

import { ToastService } from './toast.service.js';

export default angular.module('shyApp.toast', [])
  .factory('toast', ToastService)
  .name;
