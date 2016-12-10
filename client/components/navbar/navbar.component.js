'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarController {
  /*@ngInject*/
  constructor($log, $uibModal, Cart) {
    this.$log = $log;
    this.$uibModal = $uibModal;
    this.Cart = Cart;
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
      controller: ModalInstanceController
    });

    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(() => {
      this.$log.info('Closed dialog.');
    });
  }
}

export class ModalInstanceController {
  /*@ngInject*/
  constructor($log, $http, $uibModalInstance, $window) {
    this.$log = $log;
    this.$http = $http;
    this.$uibModalInstance = $uibModalInstance;
    this.$window = $window;
    this.contact = {};
    // let fieldToGetFocus = this.$window.document.getElementById('firstname');
    // fieldToGetFocus.focus();
  }

  submitContact(form) {
    // Now we have the form data in this.contact
    if(form.$valid) {
      this.$http
        .post('/api/message', this.contact)
        .then(response => {
          // Don't really need to do anything so just log data
          this.$log.info(response.data);
        })
        .catch(response => {
          // Implement: display the error in a toast since we closed the dialog already
          this.$log.error(response.err);
        });
      this.$uibModalInstance.close(); // Close the dialog quickly even though email sending is slow
    }
  }
}

export default angular.module('shyApp.navbar', [])
  .component('navbar', {
    template: require('./navbar.pug'),
    controller: NavbarController
  })
  .name;
