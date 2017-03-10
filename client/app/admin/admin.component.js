'use strict';
import angular from 'angular';
import ngResource from 'angular-resource';
import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import routes from './admin.routes';
import AuthModule from '../../components/auth/auth.module';

export class AdminController {
  /*@ngInject*/
  constructor(User, $uibModal) {
    this.User = User;
    this.$uibModal = $uibModal;
  }

  $onInit() {
    this.users = [];
    this.reverse = false;
    this.sortKey = 'lastName';
    this.submitted = false;
    this.new = false;
  }

  search(form) {
    this.submitted = true;

    if(form.$valid) {
      this.users = this.User.query({ filter: this.filterField});
    }
  }

  delete(selectedUser) {
    selectedUser.$remove({ id: selectedUser._id }); // Delete the user from the database
    this.users.splice(this.users.indexOf(selectedUser), 1); // Remove them from the array
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
      this.new = false;
    });
  }

  open(user) {
    this.handleEditing(user);
  }

  create() {
    let user = { provider: 'local', role: 'student', optOut: false };
    this.new = true;
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

          // Update validity of form fields that match the database errors
          if(err.name) {
            for(let error of err.errors) {
              form[error.path].$setValidity('database', false);
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


export default angular.module('shyApp.admin', [uiRouter, AuthModule, uiBootstrap, ngResource])
  .config(routes)
  .component('admin', {
    template: require('./admin.pug'),
    controller: AdminController
  })
  .name;
