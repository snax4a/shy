'use strict';

import angular from 'angular';

export class NavbarController {
  /*@ngInject*/
  constructor($uibModal, Cart, Auth) {
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
        state: 'checkout'
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
    });
  }
}

export class ContactModalController {
  /*@ngInject*/
  constructor($http, $uibModalInstance, Auth, $log) {
    this.$http = $http;
    this.$uibModalInstance = $uibModalInstance;
    this.Auth = Auth;
    this.$log = $log;
    this.contact = {};
    Auth.getCurrentUser()
      .then(user => {
        this.$log.info('user', user);
        this.contact.firstName = user.firstName;
        this.contact.lastName = user.lastName;
        this.contact.email = user.email;
        this.contact.phone = user.phone;
        //this.contact.user.optOut = user.optOut;
        return null;
      });
  }

  submitContact(form) {
    // Now we have the form data in this.contact
    if(form.$valid) {
      this.$http
        .post('/api/message', this.contact)
        .catch(response => {
          // Implement: display the error in a toast since we closed the dialog already
          this.$log.error(response.err);
          return null;
        });
      // Don't wait for the promise to be fulfilled because email sending is slow
      this.$uibModalInstance.close();
    }
  }

  cancel() {
    this.$uibModalInstance.close();
  }
}

export default angular.module('shyApp.navbar', [])
  .component('navbar', {
    template: require('./navbar.pug'),
    controller: NavbarController
  })
  .name;
