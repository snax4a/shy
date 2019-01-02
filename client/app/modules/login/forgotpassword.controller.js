'use strict';

export class ForgotPasswordController {
  /*@ngInject*/
  constructor($http, User, $uibModalInstance) {
    this.$http = $http;
    this.User = User;
    this.$uibModalInstance = $uibModalInstance;
    this.errors = {};
    this.email = '';
  }

  clearServerError(form, fieldName) {
    form[fieldName].$setValidity('server', true);
  }

  // Or should I use Auth Service?
  async forgotPassword(email) {
    await this.User.forgotPassword(email);
    return true;
  }

  submit(form) {
    return this.$http.post('/api/user/forgotpassword', { email: this.email })
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
