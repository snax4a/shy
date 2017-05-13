/* eslint no-sync:0 */
'use strict';
import angular from 'angular';

export class UserManagerController {
  /*@ngInject*/
  constructor($http, User, $uibModal) {
    this.$http = $http;
    this.User = User; // used by searchUsers()
    this.$uibModal = $uibModal;
  }

  $onInit() {
    this.users = [];
    this.reverse = false;
    this.sortKey = 'lastName';
    this.submitted = false;
  }

  searchUsers(form) {
    this.submitted = true;
    if(form.$valid) {
      this.User.query({ filter: this.filterField})
        .$promise
        .then(users => {
          this.users = users;
        });
    }
  }

  deleteUser(selectedUser) {
    selectedUser.$remove({ id: selectedUser._id }); // Delete the user from the server
    this.users.splice(this.users.indexOf(selectedUser), 1); // Remove them from the array
  }

  modalUserEditor(user) {
    let modalDialog = this.$uibModal.open({
      template: require('./usereditor.pug'),
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: UserEditorController,
      resolve: {
        userSelectedForEditing: () => user
      }
    });
    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(() => {
      if(user.shouldBeDeleted) this.users.splice(this.users.indexOf(user), 1); // Remove them from the array
    });
  }

  editUser(user) {
    this.modalUserEditor(user);
  }

  createUser() {
    let user = {
      _id: 0,
      provider: 'local',
      role: 'student',
      optOut: false
    };

    this.users.unshift(user);
    this.modalUserEditor(user);
  }

  sortUsers(keyname) {
    this.sortKey = keyname;
    this.reverse = !this.reverse;
  }

}

class UserEditorController {
  /*@ngInject*/
  constructor($uibModalInstance, User, userSelectedForEditing, Auth) {
    // Dependencies
    this.$uibModalInstance = $uibModalInstance;
    this.userSelectedForEditing = userSelectedForEditing;
    this.User = User;
    this.Auth = Auth;

    // Initializations - not in $onInit since not it's own component
    this.submitted = false;
    this.errors = {};
    this.user = {};
    this.isAdmin = this.Auth.isAdminSync;
    if(this.userSelectedForEditing) angular.copy(this.userSelectedForEditing, this.user);
  }

  clearServerError(form, fieldName) {
    form[fieldName].$setValidity('server', true);
  }

  submitUser(form) {
    this.submitted = true;
    if(form.$valid) {
      // Make a copy of this.user or upsert fails
      let upsertedUser = {};
      angular.copy(this.user, upsertedUser);
      this.User.upsert(upsertedUser)
        .$promise
        .then(user => { // only contains user._id
          // Do not add the password and passwordConfirm to the array
          Reflect.deleteProperty(upsertedUser, 'password'); // clear this out for security reasons
          Reflect.deleteProperty(upsertedUser, 'passwordConfirm'); // ditto

          // If a new user...
          if(upsertedUser._id === 0) {
            upsertedUser._id = user._id;
          }

          // Graft the edited user back the original
          angular.extend(this.userSelectedForEditing, upsertedUser);
          this.$uibModalInstance.close();
          return null;
        })
        .catch(response => {
          let err = response.data;
          this.errors = {}; // reset to only the latest errors

          // Update validity of form fields that match the server errors
          if(err.name) {
            for(let error of err.errors) {
              form[error.path].$setValidity('server', false);
              this.errors[error.path] = error.message;
            }
          }
          return null;
        });
    }
  }

  cancel() {
    if(!this.userSelectedForEditing._id) {
      this.userSelectedForEditing.shouldBeDeleted = true;
    }
    this.$uibModalInstance.close();
  }
}

export default angular.module('shyApp.usermanager', [])
  .component('usermanager', {
    template: require('./usermanager.pug'),
    controller: UserManagerController
  })
  .name;