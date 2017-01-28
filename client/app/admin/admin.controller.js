'use strict';
import AdminEditorController from './admineditor.controller';

export default class AdminController {
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
