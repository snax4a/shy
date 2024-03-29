/*eslint no-sync:0 */

// Controller for modal dialog for editing users
export class UserEditorController {
  /*@ngInject*/
  constructor($timeout, $uibModalInstance, Auth, User, Upload, FileService, userSelectedForEditing) {
    // Dependencies
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.Auth = Auth;
    this.User = User;
    this.fileService = FileService;
    this.uploadService = Upload;
    this.userSelectedForEditing = userSelectedForEditing; // should always be $resource

    // Initializations - not in $onInit since not it's own component
    this.submitted = false;
    this.errors = {};
    this.user = new User();
    this.uploadProgress = 0;
    this.isAdmin = this.Auth.isAdminSync;
    // Make a copy so changes aren't made unless we Submit
    if(this.userSelectedForEditing) this.user = { ...this.userSelectedForEditing };
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
          // Math.min fixes IE bug which reports 200% under certain conditions
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
      // Make a copy of this.user in case of server-side error (like duplicate email addresses)
      let upsertedUser = { ...this.user };

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
          // If a new image was uploaded, delete the old one in the database (server file system is ephemeral)
          if(this.userSelectedForEditing.imageId !== this.user.imageId) this.fileService.delete(this.userSelectedForEditing.imageId);
          // Graft the edited user back the original
          Object.assign(this.userSelectedForEditing, user);
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
