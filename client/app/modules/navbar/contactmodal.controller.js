'use strict';

export class ContactModalController {
  /*@ngInject*/
  constructor($uibModalInstance, Auth, $log, ContactService) {
    this.$uibModalInstance = $uibModalInstance;
    this.Auth = Auth;
    this.$log = $log;
    this.contactService = ContactService;
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

  messageSend(form) {
    // Now we have the form data in this.contact
    if(form.$valid) {
      this.contactService.messageSend(this.contact);
      // Don't wait for the promise to be fulfilled because email sending is slow
      this.$uibModalInstance.close();
    }
  }

  cancel() {
    this.$uibModalInstance.close();
  }
}
