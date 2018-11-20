/* eslint no-sync:0 */
'use strict';
import angular from 'angular';
import UibCollapse from 'angular-ui-bootstrap/src/collapse';
import UibDropdown from 'angular-ui-bootstrap/src/dropdown/index-nocss.js';

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
        title: 'Classes',
        link: '/classes'
      },
      {
        title: 'Workshops',
        link: '/workshops'
      },
      {
        title: 'Locations',
        link: '/locations'
      },
      {
        title: 'Teachers',
        link: '/teachers'
      },
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
        this.contact.firstName = user.firstName;
        this.contact.lastName = user.lastName;
        this.contact.email = user.email;
        this.contact.phone = user.phone;
        this.contact.optOut = user.optOut;
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

export default angular.module('shyApp.navbar', [UibCollapse, UibDropdown])
  .component('navbar', {
    template: require('./navbar.pug'),
    controller: NavbarComponent
  })
  .name;
