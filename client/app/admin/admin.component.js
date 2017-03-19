'use strict';
import angular from 'angular';
import ngResource from 'angular-resource';
import uiRouter from 'angular-ui-router';
import uiBootstrap from 'angular-ui-bootstrap';
import routes from './admin.routes';
import AuthModule from '../../components/auth/auth.module';

export class AdminController {
  /*@ngInject*/
  constructor(User, $uibModal, $log) {
    this.User = User;
    this.$uibModal = $uibModal;
    this.$log = $log;
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
      this.User.query({ filter: this.filterField})
        .$promise
        .then(users => {
          this.users = users;
          this.$log.info(users);
        });
    }
  }

  delete(selectedUser) {
    selectedUser.$remove({ id: selectedUser._id }); // Delete the user from the server
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
    let user = { _id: 0, provider: 'local', role: 'student', optOut: false };
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
  constructor($uibModalInstance, userSelectedForEditing, User, $log) {
    // Dependencies
    this.$uibModalInstance = $uibModalInstance;
    this.userSelectedForEditing = userSelectedForEditing;
    this.User = User;
    this.$log = $log;

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
      // THE PROBLEM:
      // If it's a new user, this.user._id is an object representing the current user
      // If it's an existing user, this.user._id is a number

      //if(this.user._id === 0) Reflect.deleteProperty(this.user, '_id');

      this.$log.info('before upsert', this.user);
      // Save changes to or create a new user
      let userID = this.User.upsert(this.user);
      if(!this.user._id) this.user._id = userID;

      // Do not add the password and passwordConfirm to the array
      Reflect.deleteProperty(this.user, 'password'); // clear this out for security reasons
      Reflect.deleteProperty(this.user, 'passwordConfirm'); // ditto

      this.$log.info('this.user', this.user);
      // Graft the edited user back the original
      angular.extend(this.userSelectedForEditing, this.user);
      this.$uibModalInstance.close();
      return null;
      // this.User.upsert(this.user)
      //   .$promise // What does this do?
      //   .then(user => { // only contains user._id
      //     this.$log.info('this.user', this.user);
      //     // Do not add the password and passwordConfirm to the array
      //     Reflect.deleteProperty(this.user, 'password'); // clear this out for security reasons
      //     Reflect.deleteProperty(this.user, 'passwordConfirm'); // ditto

      //     // If a new user...
      //     if(!this.user._id) {
      //       this.user._id = user._id;
      //     }

      //     // Graft the edited user back the original
      //     angular.extend(this.userSelectedForEditing, this.user);
      //     this.$uibModalInstance.close();
      //     return null;
      //   })
      //   .catch(response => {
      //     let err = response.data;
      //     this.errors = {}; // reset to only the latest errors

      //     // Update validity of form fields that match the server errors
      //     if(err.name) {
      //       for(let error of err.errors) {
      //         form[error.path].$setValidity('server', false);
      //         this.errors[error.path] = error.message;
      //       }
      //     }
      //     return null;
      //   });
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
