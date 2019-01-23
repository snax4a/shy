export class ForgotPasswordController {
  /*@ngInject*/
  constructor(User, $uibModalInstance, toast) {
    this.User = User;
    this.$uibModalInstance = $uibModalInstance;
    this.toast = toast;
    this.errors = {};
    this.email = '';
  }

  clearServerError(form, fieldName) {
    form[fieldName].$setValidity('server', true);
  }

  forgotPassword(form) {
    this.User.forgotPassword({ email: this.email })
      .$promise
      .then(() => {
        this.$uibModalInstance.close();
        this.toast({
          duration: 5000,
          message: 'A new password was emailed to you. Please check your Junk folder if you don\'t see it.',
          className: 'alert-success'
        });
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
      });
  }

  cancel() {
    this.$uibModalInstance.close(false);
  }
}
