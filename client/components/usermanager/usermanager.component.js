/* eslint no-sync:0 */
'use strict';
import angular from 'angular';
import compareTo from '../compareto/compareto.directive';
import dirPagination from 'angular-utils-pagination';
import datepickerPopup from 'angular-ui-bootstrap/src/datepickerPopup/index-nocss.js';

export class UserManagerController {
  /*@ngInject*/
  constructor($http, User, $uibModal) {
    this.$http = $http;
    this.User = User; // used by search()
    this.$uibModal = $uibModal;
  }

  // Initializations
  $onInit() {
    this.users = [];
    this.historyItems = [];
    this.historyFor = '';
    this.reverse = false;
    this.sortKey = 'lastName';
    this.submitted = false;
  }

  // Get an array of users whose email, first or last name starts with the filter
  search(form) {
    this.submitted = true;
    if(form.$valid) {
      this.User.query({ filter: this.filterField})
        .$promise
        .then(users => {
          this.users = users;
        });
    }
  }

  // Delete the user from the server and in the local array
  delete(selectedUser) {
    selectedUser.$remove({ id: selectedUser._id }); // Delete the user from the server
    this.users.splice(this.users.indexOf(selectedUser), 1); // Remove them from the array
  }

  // Get an array of purchases & attendances with a running balance
  getHistory(selectedUser) {
    this.User.history({ id: selectedUser._id })
      .$promise
      .then(historyItems => {
        this.historyFor = `${selectedUser.lastName}, ${selectedUser.firstName}`;
        this.historyItems = historyItems;
        return null;
      })
      .catch(response => {
        console.log('Error', response);
        return null;
      });
  }

  // Open modal to add classes
  modalClassAdder(user) {
    let modalDialog = this.$uibModal.open({
      template: require('./classadder.pug'),
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: ClassAdderController,
      resolve: {
        userGettingClasses: () => user
      }
    });
    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(() => {
      // if we add any classes, update the count in the grid
    });
  }

  // Open a dialog for editing the selected history item
  modalHistoryEditor(historyItem) {
    let modalDialog = this.$uibModal.open({
      template: require('./historyeditor.pug'),
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: HistoryEditorController,
      resolve: {
        historyItemSelectedForEditing: () => historyItem
      }
    });
    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(() => {
      // If we added a history record, update the count in the grid
    });
  }

  // Open a dialog for editing the user
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

  // Create a user with the appropriate defaults (enforce role setting server-side)
  createUser() {
    let user = {
      _id: 0,
      provider: 'local',
      role: 'student',
      balance: 0,
      optOut: false
    };

    this.users.unshift(user);
    this.modalUserEditor(user);
  }

  // Wrap modalUserEditor in case we need to do anything outside of it
  editUser(user) {
    this.modalUserEditor(user);
  }

  // Manage which column determines the sort and the ASC/DESC
  sortUsers(keyname) {
    this.sortKey = keyname;
    this.reverse = !this.reverse;
  }

  // Wrapper for modalClassAdder
  classAdd(user) {
    this.modalClassAdder(user);
  }

  // Problem because SHYnet UI is container for user manager so we need to get the teacher, location, date, and class title
  attendanceAdd(user, location, date, classTitle) {
    const attendance = {
      user,
      location,
      date,
      classTitle
    };
    // Now send the attendance to the server
  }

  // Same issue
  attendanceDelete(attendance) {

  }

  historyItemEdit(historyItem) {
    this.modalHistoryEditor(historyItem);
  }

  historyItemDelete(historyItem) {
    this.User.historyItemDelete({ id: historyItem._id, type: historyItem.type })
      .$promise
      .then(() => {
        this.historyItems.splice(this.historyItems.indexOf(historyItem), 1); // Remove history item from the array
        return null;
      })
      .catch(response => {
        console.log('Error', response);
        return null;
      });
  }
}

class UserEditorController {
  /*@ngInject*/
  constructor($uibModalInstance, Auth, User, userSelectedForEditing) {
    // Dependencies
    this.$uibModalInstance = $uibModalInstance;
    this.Auth = Auth;
    this.User = User;
    this.userSelectedForEditing = userSelectedForEditing;

    // Initializations - not in $onInit since not it's own component
    this.submitted = false;
    this.errors = {};
    this.user = {};
    this.isAdmin = this.Auth.isAdminSync;
    if(this.userSelectedForEditing) angular.copy(this.userSelectedForEditing, this.user);
  }

  // Reset server-side error status
  clearServerError(form, fieldName) {
    form[fieldName].$setValidity('server', true);
  }

  // Submit the modified user to the server
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

  // Cancel the user editor dialog
  cancel() {
    if(!this.userSelectedForEditing._id) {
      this.userSelectedForEditing.shouldBeDeleted = true;
    }
    this.$uibModalInstance.close();
  }
}

class ClassAdderController {
  /*@ngInject*/
  constructor($uibModalInstance, User, userGettingClasses) {
    // Dependencies
    this.$uibModalInstance = $uibModalInstance;
    this.userGettingClasses = userGettingClasses;
    this.User = User;

    // Initializations - not in $onInit since not it's own component
    this.submitted = false;
    this.purchase = {
      _id: this.userGettingClasses._id,
      UserId: this.userGettingClasses._id,
      quantity: 1,
      method: 'Cash',
      notes: '',
      createdAt: new Date()
    };

    this.datePickerOpened = false;
    this.dateOptions = {
      dateDisabled: false,
      formatYear: 'yyyy',
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(2018, 1, 1),
      startingDay: 1
    };
  }

  showCalendar() {
    this.datePickerOpened = true;
  }

  // Tell the server to add the classes to the user
  submit(form) {
    this.submitted = true;
    if(form.$valid) {
      this.User.classAdd(this.purchase)
        .$promise
        .then(() => {
          // Increment the balance for the user so we don't have to re-query
          this.userGettingClasses.balance = parseInt(this.userGettingClasses.balance, 10) + parseInt(this.purchase.quantity, 10);
          this.$uibModalInstance.close();
          return null;
        })
        .catch(response => {
          let err = response.data;
          console.log('Error', err);
          return null;
        });
    }
  }

  // Close the modal dialog without doing anything
  cancel() {
    this.$uibModalInstance.close();
  }
}

/*
  To do's:
  1. Add historyItemUpdate() to /server/api/user/user.controller.js and tests for index.spec.js, and user.integration.js
*/
class HistoryEditorController {
  /*@ngInject*/
  constructor($uibModalInstance, $http, User, historyItemSelectedForEditing) {
    // Dependencies
    this.$uibModalInstance = $uibModalInstance;
    this.$http = $http;
    this.User = User;
    this.historyItem = {};
    angular.copy(historyItemSelectedForEditing, this.historyItem);
    this.historyItem.when = Date.parse(this.historyItem.when); // Convert ISO 8601 date string to JavaScript date

    console.log('$ctrl.historyItem', this.historyItem);
    var test = new Date(2018, 9, 21);
    console.log(test);

    // Initializations - not in $onInit since not it's own component
    this.submitted = false;
    this.datePickerOpened = false;
    this.dateOptions = {
      dateDisabled: false,
      formatYear: 'yyyy',
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(2013, 1, 1),
      startingDay: 1
    };
    this.$http.get('/assets/data/teachers.json')
      .then(response => {
        this.teachers = response.data;
        return null;
      });
    this.$http.get('/assets/data/classes.json')
      .then(response => {
        this.classes = response.data;
        return null;
      });
    this.$http.get('/assets/data/locations.json')
      .then(response => {
        this.locations = response.data;
        return null;
      });
  }

  showCalendar() {
    this.datePickerOpened = true;
  }

  // Refresh historyItem.what, recalculate balance, and save historyItem
  submit(form) {
    this.submitted = true;
    if(form.$valid) {
      this.User.historyItemUpdate(this.historyItem)
        .$promise
        .then(() => {
          // TODO: redisplay the history with running total as it might have changed and refesh the user balances
          this.userGettingClasses.balance = parseInt(this.userGettingClasses.balance, 10) + parseInt(this.purchase.quantity, 10);
          this.$uibModalInstance.close();
          return null;
        })
        .catch(response => {
          let err = response.data;
          console.log('Error', err);
          return null;
        });
    }
  }

  // Close the modal dialog without doing anything
  cancel() {
    this.$uibModalInstance.close();
  }
}

export default angular.module('shyApp.usermanager', [compareTo, dirPagination, datepickerPopup])
  .component('usermanager', {
    template: require('./usermanager.pug'),
    controller: UserManagerController,
    bindings: {
      mini: '@'
    }
  })
  .name;
