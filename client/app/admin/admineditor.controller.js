'use strict';
import angular from 'angular';

// Controller for modal dialog for editing users
export default class AdminEditorController {
  /*@ngInject*/
  constructor($uibModalInstance, userSelectedForEditing, User, $log) {
    this.$uibModalInstance = $uibModalInstance;
    this.userSelectedForEditing = userSelectedForEditing;
    this.user = {};
    angular.copy(this.userSelectedForEditing, this.user);
    this.User = User; // User Service
    this.$log = $log;
    this.errors = {};
  }

  submitUser(form) {
    if(form.$valid) {
      // Graft the edited user back the original
      angular.extend(this.userSelectedForEditing, this.user);

      // Save updates to database - extend the settings functionality (updatePasword)
      // This fails!
      //this.User.update({ id: this.user._id }, this.user);
      // Original was User.update({ id: user._id }, $scope.user);

      // Close dialog
      this.$uibModalInstance.close();
    }
  }

  cancel() {
    this.$uibModalInstance.close();
  }
}
