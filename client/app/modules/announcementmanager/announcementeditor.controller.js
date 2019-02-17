export class AnnouncementEditorController {
  /*@ngInject*/
  constructor($uibModalInstance, AnnouncementService, announcementBeforeEdits) {
    // Dependencies
    this.$uibModalInstance = $uibModalInstance;
    this.announcementService = AnnouncementService;
    this.announcementBeforeEdits = announcementBeforeEdits;

    // Initializations - not in $onInit since not it's own component
    this.submitted = false;
    this.announcement = {};
    this.datePickerOpened = false;
    this.dateOptions = {
      dateDisabled: false,
      formatYear: 'yyyy',
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(),
      startingDay: 1
    };
    this.announcement = { ...this.announcementBeforeEdits };
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
      this.announcement._id = await this.announcementService.announcementUpsert(this.announcement);

      // Graft the edited announcement back the original
      Object.assign(this.announcementBeforeEdits, this.announcement);
      this.$uibModalInstance.close();

      // Success
      return true;
    }
  }

  cancel() {
    if(!this.announcementBeforeEdits._id) {
      this.announcementBeforeEdits.shouldBeDeleted = true;
    }
    this.$uibModalInstance.close();
  }
}
