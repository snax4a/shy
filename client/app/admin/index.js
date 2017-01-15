'use strict';

import angular from 'angular';
import routes from './admin.routes';
import AdminController from './admin.controller';
import AdminEditorController from './admineditor.controller';

export default angular.module('shyApp.admin', ['shyApp.auth', 'ui.router'])
  .config(routes)
  .controller('AdminController', AdminController)
  .controller('AdminEditorController', AdminEditorController)
  .name;
