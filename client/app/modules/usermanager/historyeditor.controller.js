// Controller for modal dialog - History Editor
export class HistoryEditorController {
  /*@ngInject*/
  constructor($uibModalInstance, HistoryService, TeacherService, ClassService, LocationService, historyItemToEdit) {
    // Dependencies
    this.$uibModalInstance = $uibModalInstance;
    this.historyService = HistoryService;
    this.teacherService = TeacherService;
    this.classService = ClassService;
    this.locationService = LocationService;
    this.historyItemToEdit = historyItemToEdit;
    this.historyItem = { ...this.historyItemToEdit };
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
    this.teachers = this.teacherService.teachers;
    this.classes = this.classService.classes;
    this.locations = this.locationService.locations;
  }

  showCalendar() {
    this.datePickerOpened = true;
  }

  // Refresh historyItem.what, recalculate balance, and save historyItem
  submit(form) {
    this.submitted = true;
    if(form.$valid) {
      // Adjust for differences between server and client
      let updatedHistoryItem = { ...this.historyItem };
      updatedHistoryItem.when = new Date(this.historyItem.when).toISOString();
      updatedHistoryItem.purchased = updatedHistoryItem.when;
      updatedHistoryItem.attended = updatedHistoryItem.when;
      updatedHistoryItem.method = this.historyItem.paymentMethod;
      // Send update via HTTP PUT
      this.historyService.historyItemUpdate(updatedHistoryItem)
        .then(() => {
          // Recalculate balance based on change to quantity
          updatedHistoryItem.balance = parseInt(this.historyItemToEdit.balance, 10) + parseInt(updatedHistoryItem.quantity, 10) - parseInt(this.historyItem.quantity, 10);
          // Rewrite "what" property
          if(updatedHistoryItem.type == 'P') {
            updatedHistoryItem.what = `Purchased ${updatedHistoryItem.quantity} class pass (${updatedHistoryItem.paymentMethod}) - ${updatedHistoryItem.notes}`;
          } else {
            updatedHistoryItem.what = `Attended ${updatedHistoryItem.className} in ${updatedHistoryItem.location} (${updatedHistoryItem.teacher})`;
          }

          // Graft historyItem back
          Object.assign(this.historyItemToEdit, updatedHistoryItem);

          this.$uibModalInstance.close();
          return null;
        })
        .catch(response => console.error('Error', response));
    }
  }

  // Close the modal dialog without doing anything
  cancel() {
    this.$uibModalInstance.close();
  }
}
