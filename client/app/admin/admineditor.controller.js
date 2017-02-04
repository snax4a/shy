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
    this.submitted = false;
    this.errors = {};
  }

  submitUser(form) {
    this.submitted = true;
    if(form.$valid) {
      // Save changes to or create a new user
      this.User.upsert(this.user)
        .$promise
        .then(user => {
          // Do not add the password and passwordConfirm to the array
          Reflect.deleteProperty(this.user, 'password'); // clear this out for security reasons
          Reflect.deleteProperty(this.user, 'passwordConfirm'); // ditto

          // If a new user...
          if(!this.user._id) {
            this.user._id = user._id;
          }

          // Graft the edited user back the original
          angular.extend(this.userSelectedForEditing, this.user);
          this.$uibModalInstance.close();
          return null;
        })
        .catch(response => {
          let err = response.data;
          this.errors = {}; // reset to only the latest errors

          // Update validity of form fields that match the sequelize errors
          if(err.name) {
            for(let error of err.errors) {
              form[error.path].$setValidity('sequelize', false);
              this.errors[error.path] = error.message;
            }
          }
          return null;
        });
    }
  }

  cancel() {
    if(!this.userSelectedForEditing._id) {
      this.$log.info('Cancelled during creation of a new user');
      this.userSelectedForEditing.shouldBeDeleted = true;
    }
    this.$uibModalInstance.close();
  }
}
