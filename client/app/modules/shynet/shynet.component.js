export class SHYnetComponent {
  /*@ngInject*/
  constructor($uibModal, TeacherService, ClassService, LocationService, HistoryService) {
    this.$uibModal = $uibModal;
    this.teacherService = TeacherService;
    this.classService = ClassService;
    this.locationService = LocationService;
    this.historyService = HistoryService;
  }

  $onInit() {
    this.teachers = this.teacherService.teachers;
    this.classes = this.classService.classes;
    this.locations = this.locationService.locations;
    const now = new Date();
    this.attended = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    this.datePickerOpened = false;
    this.dateOptions = {
      dateDisabled: false,
      formatYear: 'yyyy',
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(2014, 1, 1),
      startingDay: 1
    };
    this.submitted = false;
    this.attendees = [];
  }

  showCalendar() {
    this.datePickerOpened = true;
  }

  attendeeLookup() {
    this.historyService.attendeesGet(this.attended, this.locationId, this.classId, this.teacherId)
      .then(attendees => {
        this.attendees = attendees;
      });
  }

  attendeeDelete(attendee) {
    this.historyService.attendeeDelete(attendee)
      .then(() => {
        this.user = { // triggers $onChanges() in usermanager.component.js
          _id: attendee.userId,
          balanceChange: -1
          //ts: new Date().getTime() // forces user to be different even if _id is not
        };
        this.attendees.splice(this.attendees.indexOf(attendee), 1); // Remove attendee from array
        return true;
      })
      .catch(response => console.error('Error deleting attendee', response));
  }
}
