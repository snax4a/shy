'use strict';

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
    /*let modalInstance = */ this.$uibModal.open({
      templateUrl: 'UserEditor.html',
      controller: 'ModalInstanceCtrl',
      resolve: {
        user: () => _user
      }
    });
  }

  sort(keyname) {
    this.sortKey = keyname;
    this.reverse = !this.reverse;
  }
}
