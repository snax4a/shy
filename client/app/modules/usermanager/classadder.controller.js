// Controller for modal dialog to add classes
export class ClassAdderController {
  /*@ngInject*/
  constructor($uibModalInstance, $http, userGettingClasses) {
    // Dependencies
    this.$uibModalInstance = $uibModalInstance;
    this.$http = $http;
    this.userGettingClasses = userGettingClasses;

    // Initializations - not in $onInit since not it's own component
    this.submitted = false;
    const now = new Date();
    this.purchase = {
      type: 'P',
      UserId: this.userGettingClasses._id,
      quantity: 1,
      method: 'Cash',
      notes: '',
      purchased: new Date(now.getFullYear(), now.getMonth(), now.getDate())
    };

    this.datePickerOpened = false;
    this.dateOptions = {
      dateDisabled: false,
      formatYear: 'yyyy',
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(2013, 1, 1),
      startingDay: 1
    };
  }

  showCalendar() {
    this.datePickerOpened = true;
  }

  // Tell the server to add the classes to the user
  submit(form) {
    this.submitted = true;
    if(form.$valid) {
      // Got a 401 error here!
      this.$http.post('/api/history', this.purchase)
        .then(() => {
          // Increment the balance for the user so we don't have to re-query
          this.userGettingClasses.balance = parseInt(this.userGettingClasses.balance, 10) + parseInt(this.purchase.quantity, 10);
          this.$uibModalInstance.close();
          return null;
        })
        .catch(response => {
          console.log('Error', response);
          return null;
        });
    }
  }

  // Close the modal dialog without doing anything
  cancel() {
    this.$uibModalInstance.close();
  }
}
