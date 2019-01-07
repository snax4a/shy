import { ForgotPasswordController } from './forgotpassword.controller';

export class LoginComponent {
  /*@ngInject*/
  constructor($location, $window, $uibModal, Auth) {
    this.$location = $location;
    this.$window = $window;
    this.$uibModal = $uibModal;
    this.authService = Auth;
  }

  $onInit() {
    this.user = {
      name: '',
      email: '',
      password: ''
    };
    this.errors = { login: undefined };
    this.submitted = false;
  }

  login(form) {
    this.submitted = true;

    if(form.$valid) {
      const { email, password } = this.user;
      this.authService.login({ email, password })
        .then(user => {
          let nextPath = '/';
          if(user.role === 'teacher') nextPath = '/shynet';
          if(user.role === 'admin') nextPath = '/admin';
          this.$location.path(nextPath);
        })
        .catch(err => {
          this.errors.login = err.message;
        });
    }
  }

  forgotPassword() {
    let modalDialog = this.$uibModal.open({
      template: require('./forgotpassword.pug'),
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: ForgotPasswordController
    });

    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(() => {
    });
  }
}
