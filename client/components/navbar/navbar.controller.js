/* eslint no-sync:0 */
import ContactModalController from './contactmodal.controller';

export default class NavbarController {
  /*@ngInject*/
  constructor($log, $uibModal, Cart, Auth) {
    this.$log = $log;
    this.$uibModal = $uibModal;
    this.Cart = Cart;
    this.Auth = Auth;
  }

  $onInit() {
    this.isLoggedIn = this.Auth.isLoggedInSync;
    this.isAdmin = this.Auth.isAdminSync;
    this.getCurrentUser = this.Auth.getCurrentUserSync;
    this.isCollapsed = true;
    this.menu = [
      {
        title: 'Classes',
        state: 'classes'
      },
      {
        title: 'Workshops',
        state: 'workshops'
      },
      {
        title: 'Locations',
        state: 'locations'
      },
      {
        title: 'Teachers',
        state: 'teachers'
      },
      {
        title: 'Cart',
        state: 'cart'
      }
    ];
  }

  // Use UI-Bootstrap to open a modal
  contactModalOpen() {
    let modalDialog = this.$uibModal.open({
      template: require('./contactmodal.pug'),
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: ContactModalController
    });

    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(() => {
      this.$log.info('Closed dialog.');
    });
  }
}
