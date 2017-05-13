/* eslint no-sync:0 */
'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './admin.routes';
import ngResource from 'angular-resource'; // delete() relies on this
import UserManager from '../../components/usermanager/usermanager.component';

export class AdminController {
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
    this.$http.get('/api/schedule?flat=true')
      .then(response => {
        this.scheduleItems = response.data;
        return null;
      });
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

  modalScheduleEditor(scheduleItem) {
    let modalDialog = this.$uibModal.open({
      template: require('./scheduleeditor.pug'),
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: ScheduleEditorController,
      resolve: {
        scheduleItemSelectedForEditing: () => scheduleItem
      }
    });
    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(() => {
      if(scheduleItem.shouldBeDeleted) this.scheduleItems.splice(this.scheduleItems.indexOf(scheduleItem), 1); // Remove them from the array
    });
  }

  editScheduleItem(scheduleItem) {
    this.modalScheduleEditor(scheduleItem);
  }

  createScheduleItem() {
    let scheduleItem = {
      _id: 0,
      location: 'Squirrel Hill',
      day: 1,
      teacher: 'Leta Koontz',
      title: 'Yoga 1',
      startTime: '18:00',
      endTime: '19:30',
      canceled: false
    };

    this.scheduleItems.unshift(scheduleItem);
    this.modalScheduleEditor(scheduleItem);
  }

  deleteScheduleItem(selectedScheduleItem) {
    this.$http.delete(`/api/schedule/${selectedScheduleItem._id}`)
      .then(() => this.scheduleItems.splice(this.scheduleItems.indexOf(selectedScheduleItem), 1));
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

class ScheduleEditorController {
  /*@ngInject*/
  constructor($http, $uibModalInstance, scheduleItemSelectedForEditing) {
    // Dependencies
    this.$http = $http;
    this.$uibModalInstance = $uibModalInstance;
    this.scheduleItemSelectedForEditing = scheduleItemSelectedForEditing;

    // Initializations - not in $onInit since not it's own component
    this.weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.submitted = false;
    this.errors = {};
    this.scheduleItem = {};
    this.$http.get('/assets/data/teachers.json')
      .then(response => {
        this.teachers = response.data;
        return null;
      });
    this.$http.get('/assets/data/classes.json')
      .then(response => {
        this.classes = response.data;
        return null;
      });
    this.$http.get('/assets/data/locations.json')
      .then(response => {
        this.locations = response.data;
        return null;
      });
    angular.copy(this.scheduleItemSelectedForEditing, this.scheduleItem);
  }

  submitScheduleItem(form) {
    this.submitted = true;
    if(form.$valid) {
      // Make a copy of this.user or upsert fails
      let upsertedScheduleItem = {};
      angular.copy(this.scheduleItem, upsertedScheduleItem);

      this.$http.put(`/api/schedule/${upsertedScheduleItem._id}`, upsertedScheduleItem)
        .then(response => { // only contains Schedules._id
          // If a new schedule item...
          if(upsertedScheduleItem._id === 0) {
            upsertedScheduleItem._id = response.data._id;
          }

          // Graft the edited scheduled item back the original
          angular.extend(this.scheduleItemSelectedForEditing, upsertedScheduleItem);
          this.$uibModalInstance.close();
          return null;
        });
    }
  }

  cancel() {
    if(!this.scheduleItemSelectedForEditing._id) {
      this.scheduleItemSelectedForEditing.shouldBeDeleted = true;
    }
    this.$uibModalInstance.close();
  }
}

export default angular.module('shyApp.admin', [uiRouter, UserManager, ngResource])
  .config(routes)
  .component('admin', {
    template: require('./admin.pug'),
    controller: AdminController
  })
  .name;
