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
    user.$remove({ id: user._id });
    this.users.splice(this.users.indexOf(user), 1);
  }

  open(_user) {
    let modalDialog = this.$uibModal.open({
      templateUrl: require('./admineditor.pug'),
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: AdminEditorController,
      resolve: {
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