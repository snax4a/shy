'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarController {
  /*@ngInject*/
  constructor($uibModal, Cart) {
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
    var modalDialog = this.$uibModal.open({
      template: require('./contactmodal.pug'),
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: ModalInstanceController
    });
    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(function() {
      console.log('Closed dialog.');
    });
  }
}

export class ModalInstanceController {
  /*@ngInject*/
  constructor($uibModalInstance) {
    this.$uibModalInstance = $uibModalInstance;
  }

  submitContact(form) {
    // Now we have the form data in this.contact
    if(form.$valid) {
      // Implement HTTP PUT to server
      console.log(this.contact);
      this.$uibModalInstance.close();
    }
  }
}

export default angular.module('directives.navbar', [])
  .component('navbar', {
    template: require('./navbar.pug'),
    controller: NavbarController
  })
  .name;
