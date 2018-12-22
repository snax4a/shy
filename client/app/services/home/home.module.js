'use strict';
import angular from 'angular';

import { HomeService } from './home.service';

export default angular.module('shyApp.homeService', [])
  .service('HomeService', HomeService)
  .name;
