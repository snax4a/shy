'use strict';

export class ForgotPasswordController {
  /*@ngInject*/
  constructor($http, $uibModalInstance) {
    this.$http = $http;
    this.$uibModalInstance = $uibModalInstance;
    this.errors = {};
    this.email = '';
  }

  clearServerError(form, fieldName) {
    form[fieldName].$setValidity('server', true);
  }

  submit(form) {
    return this.$http.post('/api/users/forgotpassword', { email: this.email })
      .then(() => {
        this.$uibModalInstance.close();
        return null;
      })
      .catch(response => {
        let err = response.data;
        this.errors = err.errors;

        // Update validity of form fields that match the server errors
        for(let error of err.errors) {
          form[error.path].$setValidity('server', false);
          this.errors[error.path] = error.message;
        }
        return null;
      }); // $http.post
  }

  cancel() {
    this.$uibModalInstance.close(false);
  }
}
