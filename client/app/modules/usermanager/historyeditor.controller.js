import angular from 'angular'; // for angular.copy

// Controller for modal dialog - History Editor
export class HistoryEditorController {
  /*@ngInject*/
  constructor($uibModalInstance, $http, historyItemToEdit, TeachersService, ClassesService, LocationsService) {
    // Dependencies
    this.$uibModalInstance = $uibModalInstance;
    this.$http = $http; // For HTTP PUT in submit()
    this.teachersService = TeachersService;
    this.classesService = ClassesService;
    this.locationsService = LocationsService;
    this.historyItemToEdit = historyItemToEdit;
    this.historyItem = {};
    angular.copy(this.historyItemToEdit, this.historyItem);
    this.historyItem.when = Date.parse(this.historyItem.when); // Convert ISO 8601 date string to JavaScript date

    // Initializations - not in $onInit since not it's own component
    this.submitted = false;
    this.datePickerOpened = false;
    this.dateOptions = {
      dateDisabled: false,
      formatYear: 'yyyy',
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(2013, 1, 1),
      startingDay: 1
    };
    this.teachers = this.teachersService.teachers;
    this.classes = this.classesService.classes;
    this.locations = this.locationsService.locations;
  }

  showCalendar() {
    this.datePickerOpened = true;
  }

  // Refresh historyItem.what, recalculate balance, and save historyItem
  submit(form) {
    this.submitted = true;
    if(form.$valid) {
      // Adjust for differences between server and client
      let updatedHistoryItem = {};
      angular.copy(this.historyItem, updatedHistoryItem);
      updatedHistoryItem.when = new Date(this.historyItem.when).toISOString();
      updatedHistoryItem.purchased = updatedHistoryItem.when;
      updatedHistoryItem.attended = updatedHistoryItem.when;
      updatedHistoryItem.method = this.historyItem.paymentMethod;
      // Send update via HTTP PUT
      this.$http.put(`/api/history/${updatedHistoryItem._id}`, updatedHistoryItem)
        .then(() => {
          // Recalculate balance based on change to quantity
          updatedHistoryItem.balance = parseInt(this.historyItemToEdit.balance, 10) + parseInt(updatedHistoryItem.quantity, 10) - parseInt(this.historyItem.quantity, 10);
          // Rewrite "what" property
          if(updatedHistoryItem.type == 'P') {
            updatedHistoryItem.what = `Purchased ${updatedHistoryItem.quantity} class pass (${updatedHistoryItem.paymentMethod}) - ${updatedHistoryItem.notes}`;
          } else {
            updatedHistoryItem.what = `Attended ${updatedHistoryItem.classTitle} in ${updatedHistoryItem.location} (${updatedHistoryItem.teacher})`;
          }

          // Graft historyItem back
          angular.extend(this.historyItemToEdit, updatedHistoryItem);

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
