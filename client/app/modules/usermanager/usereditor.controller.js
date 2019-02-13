/*eslint no-sync:0 */
import angular from 'angular'; // for angular copy

// Controller for modal dialog for editing users
export class UserEditorController {
  /*@ngInject*/
  constructor($timeout, $uibModalInstance, Auth, User, Upload, userSelectedForEditing) {
    // Dependencies
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.Auth = Auth;
    this.User = User;
    this.uploadService = Upload;
    this.userSelectedForEditing = userSelectedForEditing; // should always be $resource

    // Initializations - not in $onInit since not it's own component
    this.submitted = false;
    this.errors = {};
    this.user = new User();
    this.uploadProgress = 0;
    this.isAdmin = this.Auth.isAdminSync;
    // Make a copy so changes aren't made unless we Submit
    if(this.userSelectedForEditing) angular.copy(this.userSelectedForEditing, this.user);
  }

  uploadPhoto(file) {
    if(file) {
      this.uploadService.upload({
        url: '/api/file/upload',
        data: { file }
      })
        .then(response => {
          this.user.imageId = response.data.id;
        }, response => {
          if(response.status > 0) console.log(`${response.status}: ${response.data}`);
        }, evt => {
          // Math.min is to fix IE which reports 200% sometimes
          this.uploadProgress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total, 10));
        });
    }
  }

  // Reset server-side error status
  clearServerError(form, fieldName) {
    form[fieldName].$setValidity('server', true);
  }

  // Submit the modified user to the server
  submitUser(form) {
    this.submitted = true;
    if(form.$valid) {
      // Make a copy of this.user in case upsert fails
      let upsertedUser = new this.User();
      angular.copy(this.user, upsertedUser);
      Reflect.deleteProperty(upsertedUser, 'balance'); // Isn't processed by API anyway
      if(!this.isAdmin()) { // Only admins can update these fields (also enforced on server)
        Reflect.deleteProperty(upsertedUser, 'bio');
        Reflect.deleteProperty(upsertedUser, 'displayOrder');
        Reflect.deleteProperty(upsertedUser, 'google');
        Reflect.deleteProperty(upsertedUser, 'imageId');
        Reflect.deleteProperty(upsertedUser, 'passwordNew');
        Reflect.deleteProperty(upsertedUser, 'passwordConfirm');
        Reflect.deleteProperty(upsertedUser, 'provider');
        Reflect.deleteProperty(upsertedUser, 'role');
        Reflect.deleteProperty(upsertedUser, 'url');
      }
      this.User.upsert(upsertedUser)
        .$promise
        .then(user => { // Resource object with all the user fields except password and salt
          // Graft the edited user back the original
          angular.extend(this.userSelectedForEditing, user);
          return this.$uibModalInstance.close();
        })
        .catch(response => {
          const { errors } = response.data;

          // Update validity of form fields that match the server errors
          for(let error of errors) {
            form[error.path].$setValidity('server', false);
            this.errors[error.path] = error.message;
          }
          return null;
        });
    }
  }

  // Cancel the user editor dialog
  cancel() {
    if(!this.userSelectedForEditing._id) {
      this.userSelectedForEditing.shouldBeDeleted = true;
    }
    this.$uibModalInstance.close();
  }
}
