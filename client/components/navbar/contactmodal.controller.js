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

  cancel() {
    this.$uibModalInstance.close();
  }
}
