'use strict';
import angular from 'angular';

// Controller for modal dialog for editing users
export default class AdminEditorController {
  /*@ngInject*/
  constructor($uibModalInstance, user, User, $log) {
    this.$uibModalInstance = $uibModalInstance;
    this.user = {};
    angular.copy(user, this.user);
    this.User = User; // User Service
    this.$log = $log;
    this.errors = {};

    // Take the promise and graft the edited user into the original
    this.$uibModalInstance.result.then(() => angular.extend(user, this.user));
  }

  update(form) {
    if(form.$valid) {
      // Original was User.update({ id: user._id }, $scope.user);
      this.User.update({ id: this.user._id }, this.user);
    }
    this.$uibModalInstance.close(this.user);
  }

  cancel() {
    this.$uibModalInstance.dismiss('cancel'); // might trigger error - maybe use .close()
  }
}
