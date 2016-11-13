'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarController {
  /*@ngInject*/
  constructor($log, $uibModal, Cart) {
    this.$log = $log;
    this.$uibModal = $uibModal;
    this.Cart = Cart;
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
  constructor($log, $uibModalInstance, $window) {
    this.$log = $log;
    this.$uibModalInstance = $uibModalInstance;
    this.$window = $window;
    this.contact = {};
    // let fieldToGetFocus = this.$window.document.getElementById('firstname');
    // fieldToGetFocus.focus();
  }

  submitContact(form) {
    // Now we have the form data in this.contact
    if(form.$valid) {
      // Implement HTTP PUT to server
      this.$log.info(this.contact);
      this.$uibModalInstance.close();
    }
  }
}

export default angular.module('shyApp.navbar', [])
  .component('navbar', {
    template: require('./navbar.pug'),
    controller: NavbarController
  })
  .name;
