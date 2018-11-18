'use strict';

import angular from 'angular';
import { UtilService } from './util.service';

export default angular.module('shyApp.util', [])
  .factory('Util', UtilService)
  .name;
