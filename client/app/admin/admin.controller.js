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
    //this.users = this.User.query(); // fetch all users (but this might be too slow)
    this.users = this.User.query();
    this.reverse = false;
    this.sortKey = 'lastName';
  }

  delete(user) {
    user.$remove({ id: user._id }); // Delete the user from the database
    this.users.splice(this.users.indexOf(user), 1); // Remove them from the array
  }

  open(_user) {
    this.$log.info('Editing user', _user);
    let modalDialog = this.$uibModal.open({
      template: require('./admineditor.pug'),
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: AdminEditorController,
      resolve: { // Might not need this here as I can put it in modalDialog.result.then()
        user: () => _user
      }
    });

    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(() => {
      this.$log.info('Closed dialog.');
    });
  }

  sort(keyname) {
    this.sortKey = keyname;
    this.reverse = !this.reverse;
  }
}
