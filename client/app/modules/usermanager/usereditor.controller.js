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
    this.Upload = Upload;
    this.userSelectedForEditing = userSelectedForEditing; // should always be $resource

    // Initializations - not in $onInit since not it's own component
    this.submitted = false;
    this.errors = {};
    this.errorMsg = {};
    this.user = new User();
    this.isAdmin = this.Auth.isAdminSync;
    if(this.userSelectedForEditing) angular.copy(this.userSelectedForEditing, this.user);
  }

  uploadPhoto(file) {
    file.upload = this.Upload.upload({
      url: 'http://localhost:3000/api/user/photo',
      data: { file }
    });
    file.upload.then(response => {
      this.$timeout(() => {
        file.result = response.data;
      });
    }, response => {
      if(response.status > 0) this.errorMsg = `${response.status}: ${response.data}`;
    }, evt => {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total, 10));
    });
  }

  // Angular upload example
  // Upload.upload({
  //   url: 'api/upload',
  //   method: 'POST',
  //   data: data, // Any data needed to be submitted along with the files
  //   file: files // 1..n files
  // });

  // Node setup
  // Requires multiparty
  // multiparty = require('connect-multiparty'),
  // multipartyMiddleware = multiparty(),

  // // Requires controller
  // FileUploadController = require('./controllers/FileUploadController');

  // // Example endpoint
  // router.post('/api/upload', multipartyMiddleware, FileUploadController.uploadFile);

  // // FileUploadController.js
  // FileUploadController = function() {};

  // FileUploadController.prototype.uploadFile = function(req, res) {
  //   /**
  //    * The following takes the blob uploaded to an arbitrary location with
  //    * a random file name and copies it to the specified file.path with the file.name.
  //    * Note that the file.name should come from your upload request on the client side
  //    * because when the file is selected it is paired with its name. The file.name is
  //    * not random nor is the file.path.
  //    */
  //   fs.readFile(req.files.file.path, function (err, data) {
  //     // set the correct path for the file not the temporary one from the API:
  //     file.path = "/media/images/" + file.name;

  //     // copy the data from the req.files.file.path and paste it to file.path
  //     fs.writeFile(file.path, data, function (err) {
  //       if (err) {
  //         return console.warn(err);
  //       }
  //       console.log("The file: " + file.name + " was saved to " + file.path);
  //     });
  //   });
  // }

  // module.exports = new FileUploadController();

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
      console.log('this.user', this.user); // TODO: Remove
      Reflect.deleteProperty(upsertedUser, 'balance'); // Isn't processed by API anyway
      if(!this.isAdmin()) { // Only admins can update these fields (also enforced on server)
        Reflect.deleteProperty(upsertedUser, 'bio');
        Reflect.deleteProperty(upsertedUser, 'displayOrder');
        Reflect.deleteProperty(upsertedUser, 'google');
        Reflect.deleteProperty(upsertedUser, 'image');
        Reflect.deleteProperty(upsertedUser, 'imageName');
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
