'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class NavbarComponent {
  /*@ngInject*/
  constructor($uibModal) {
    this.$uibModal = $uibModal;
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
    //BUG: If invoked by UI Bootstrap Dropdown, gets "TypeError: null is not an object (evaluating 'openScope.$apply')" during closeDropdowns
    //  Only occurs on macOS with Safari
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
    controller: NavbarComponent
  })
  .name;
