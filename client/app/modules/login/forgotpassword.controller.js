export class ForgotPasswordController {
  /*@ngInject*/
  constructor(User, $uibModalInstance) {
    this.User = User;
    this.$uibModalInstance = $uibModalInstance;
    this.errors = {};
    this.email = '';
  }

  clearServerError(form, fieldName) {
    form[fieldName].$setValidity('server', true);
  }

  // Or should I use Auth Service?
  forgotPassword(email) {
    this.User.forgotPassword(email)
      .$promise
      .then(() => this.$uibModalInstance.close())
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

  submit(form) {
    this.forgotPassword({ email: this.email });
    // TODO: Put a toast here.
  }

  cancel() {
    this.$uibModalInstance.close(false);
  }
}
