'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import routes from './admin.routes';
import ngResource from 'angular-resource'; // delete() relies on this
import AuthModule from '../../components/auth/auth.module';

export class AdminController {
  /*@ngInject*/
  constructor($http, User, $uibModal, $log) {
    this.$http = $http;
    this.User = User;
    this.$uibModal = $uibModal;
    this.$log = $log;
  }

  $onInit() {
    this.users = [];
    this.$http.get('/api/announcement?flat=true')
      .then(response => {
        this.announcements = response.data;
        return null;
      });
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

  deleteAnnouncement(selectedAnnouncement) {
    selectedAnnouncement.$remove({ _id: selectedAnnouncement._id }); // Delete the announcement from the server
    this.announcements.splice(this.announcements.indexOf(selectedAnnouncement), 1); // Remove from the array
  }

  handleEditing(user) {
    let modalDialog = this.$uibModal.open({
      template: require('./admineditor.pug'),
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: AdminEditorController,
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
    this.handleEditing(user);
  }

  createUser() {
    let user = {
      _id: 0,
      provider: 'local',
      role: 'student',
      optOut: false
    };

    this.users.unshift(user);
    this.handleEditing(user);
  }

  sort(keyname) {
    this.sortKey = keyname;
    this.reverse = !this.reverse;
  }
}

class AdminEditorController {
  /*@ngInject*/
  constructor($uibModalInstance, userSelectedForEditing, User) {
    // Dependencies
    this.$uibModalInstance = $uibModalInstance;
    this.userSelectedForEditing = userSelectedForEditing;
    this.User = User;

    // Initializations - not in $onInit since not it's own component
    this.submitted = false;
    this.errors = {};
    this.user = {};
    angular.copy(this.userSelectedForEditing, this.user);
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


export default angular.module('shyApp.admin', [uiRouter, uiBootstrap, AuthModule, ngResource])
  .config(routes)
  .component('admin', {
    template: require('./admin.pug'),
    controller: AdminController
  })
  .name;
