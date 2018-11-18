/* eslint no-sync:0 */
'use strict';
import angular from 'angular';
import datepickerPopup from 'angular-ui-bootstrap/src/datepickerPopup/index-nocss.js';

export class AnnouncementManagerController {
  /*@ngInject*/
  constructor($http, $uibModal) {
    this.$http = $http;
    this.$uibModal = $uibModal;
  }

  $onInit() {
    this.$http.get('/api/announcement?flat=true')
      .then(response => {
        this.announcements = response.data;
        return null;
      });
    this.submitted = false;
  }

  modalAnnouncementEditor(announcement) {
    let modalDialog = this.$uibModal.open({
      template: require('./announcementeditor.pug'),
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: AnnouncementEditorController,
      resolve: {
        announcementSelectedForEditing: () => announcement
      }
    });
    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(() => {
      if(announcement.shouldBeDeleted) this.announcements.splice(this.announcements.indexOf(announcement), 1); // Remove them from the array
    });
  }

  editAnnouncement(announcement) {
    this.modalAnnouncementEditor(announcement);
  }

  createAnnouncement() {
    let d = new Date();
    let announcement = {
      _id: 0,
      section: '',
      title: '',
      description: '',
      expires: d.setMonth(d.getMonth() + 1)
    };

    this.announcements.unshift(announcement);
    this.modalAnnouncementEditor(announcement);
  }

  deleteAnnouncement(selectedAnnouncement) {
    this.$http.delete(`/api/announcement/${selectedAnnouncement._id}`)
      .then(() => this.announcements.splice(this.announcements.indexOf(selectedAnnouncement), 1));
  }
}

class AnnouncementEditorController {
  /*@ngInject*/
  constructor($http, $uibModalInstance, announcementSelectedForEditing) {
    // Dependencies
    this.$http = $http;
    this.$uibModalInstance = $uibModalInstance;
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

  submitAnnouncement(form) {
    this.submitted = true;
    if(form.$valid) {
      // Make a copy of this.user or upsert fails
      let upsertedAnnouncement = {};
      angular.copy(this.announcement, upsertedAnnouncement);

      this.$http.put(`/api/announcement/${upsertedAnnouncement._id}`, upsertedAnnouncement)
        .then(response => { // only contains announcement._id
          // If a new announcement...
          if(upsertedAnnouncement._id === 0) {
            upsertedAnnouncement._id = response.data._id;
          }

          // Graft the edited announcement back the original
          angular.extend(this.announcementSelectedForEditing, upsertedAnnouncement);
          this.$uibModalInstance.close();
          return null;
        });
    }
  }

  cancel() {
    if(!this.announcementSelectedForEditing._id) {
      this.announcementSelectedForEditing.shouldBeDeleted = true;
    }
    this.$uibModalInstance.close();
  }
}

export default angular.module('shyApp.announcementmanager', [datepickerPopup])
  .component('announcementmanager', {
    template: require('./announcementmanager.pug'),
    controller: AnnouncementManagerController
  })
  .name;
