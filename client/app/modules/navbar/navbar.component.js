/* eslint no-sync:0 */
import { ContactModalController } from './contactmodal.controller';

export class NavbarComponent {
  /*@ngInject*/
  constructor($location, $uibModal, Cart, Auth) {
    this.$location = $location;
    this.$uibModal = $uibModal;
    this.Cart = Cart;
    this.Auth = Auth;
  }

  $onInit() {
    this.isLoggedIn = this.Auth.isLoggedInSync;
    this.isAdmin = this.Auth.isAdminSync;
    this.isAdminOrTeacher = this.Auth.isAdminOrTeacherSync;
    this.getCurrentUser = this.Auth.getCurrentUserSync;
    this.isCollapsed = true;
    this.menu = [
      {
        title: 'Schedule',
        link: '/classes'
      },
      {
        title: 'Workshops',
        link: '/workshops'
      },
      // {
      //   title: 'Locations',
      //   link: '/locations'
      // },
      // {
      //   title: 'Teachers',
      //   link: '/teachers'
      // },
      {
        title: 'Cart',
        link: '/checkout'
      }
    ];
  }

  isActive(route) {
    return route === this.$location.path();
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
    });
  }
}
