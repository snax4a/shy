'use strict';
import angular from 'angular'; // for angular.copy

export class AnnouncementEditorController {
  /*@ngInject*/
  constructor($uibModalInstance, AnnouncementService, announcementSelectedForEditing) {
    // Dependencies
    this.$uibModalInstance = $uibModalInstance;
    this.announcementService = AnnouncementService;
    this.announcementSelectedForEditing = announcementSelectedForEditing;

    // Initializations - not in $onInit since not it's own component
    this.submitted = false;
    this.errors = {};
    this.announcement = {};
    this.datePickerOpened = false;
    this.dateOptions = {
      dateDisabled: false,
      formatYear: 'yyyy',
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(),
      startingDay: 1
    };
    angular.copy(this.announcementSelectedForEditing, this.announcement);
    // Convert ISO 8601 to a JavaScript date (if needed)
    if(typeof this.announcement.expires === 'string') this.announcement.expires = Date.parse(this.announcement.expires);
  }

  showCalendar() {
    this.datePickerOpened = true;
  }

  async submitAnnouncement(form) {
    this.submitted = true;
    if(form.$valid) {
      // Make a copy of this.user or upsert fails
      let upsertedAnnouncement = {};
      angular.copy(this.announcement, upsertedAnnouncement);

      upsertedAnnouncement._id = await this.announcementService.announcementUpsert(upsertedAnnouncement);

      // Graft the edited announcement back the original
      angular.extend(this.announcementSelectedForEditing, upsertedAnnouncement);
      this.$uibModalInstance.close();

      // Success
      return true;
    }
  }

  cancel() {
    if(!this.announcementSelectedForEditing._id) {
      this.announcementSelectedForEditing.shouldBeDeleted = true;
    }
    this.$uibModalInstance.close();
  }
}
