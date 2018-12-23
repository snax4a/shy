'use strict';

export class SHYnetComponent {
  /*@ngInject*/
  constructor($uibModal, TeachersService, ClassesService, LocationsService, AttendanceService) {
    this.$uibModal = $uibModal;
    this.teachersService = TeachersService;
    this.classesService = ClassesService;
    this.locationsService = LocationsService;
    this.attendanceService = AttendanceService;
  }

  $onInit() {
    this.teachers = this.teachersService.teachers;
    this.classes = this.classesService.classes;
    this.locations = this.locationsService.locations;
    const now = new Date();
    this.classDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    this.datePickerOpened = false;
    this.dateOptions = {
      dateDisabled: false,
      formatYear: 'yyyy',
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(2013, 1, 1),
      startingDay: 1
    };
    this.submitted = false;
    this.attendees = [];
  }

  showCalendar() {
    this.datePickerOpened = true;
  }

  attendeeLookup() {
    this.attendanceService.attendeesGet(this.classDate, this.location, this.classTitle, this.teacher)
      .then(attendees => {
        this.attendees = attendees;
      });
  }

  attendeeDelete(attendee) {
    this.attendanceService.attendeeDelete(attendee)
      .then(() => {
        // For usermanager to update balance
        this.user = {
          _id: attendee.UserId,
          ts: new Date().getTime() // forces user to be different even if _id is not
        };
        this.attendees.splice(this.attendees.indexOf(attendee), 1); // Remove attendee from array
        return true;
      });
  }
}
