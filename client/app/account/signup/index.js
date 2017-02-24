'use strict';

import angular from 'angular';
import SignupController from './signup.controller';

export default angular.module('shyApp.signupOld', [])
  .controller('SignupController', SignupController)
  .name;
