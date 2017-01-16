export default class ContactModalController {
  /*@ngInject*/
  constructor($log, $http, $uibModalInstance) {
    this.$log = $log;
    this.$http = $http;
    this.$uibModalInstance = $uibModalInstance;
    this.contact = {};
  }

  submitContact(form) {
    // Now we have the form data in this.contact
    if(form.$valid) {
      this.$http
        .post('/api/message', this.contact)
        .catch(response => {
          // Implement: display the error in a toast since we closed the dialog already
          this.$log.error(response.err);
        });
      // Don't wait for the promise to be fulfilled because email sending is slow
      this.$uibModalInstance.close();
    }
  }

  cancel() {
    this.$uibModalInstance.close();
  }
}
