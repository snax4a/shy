/* eslint no-sync:0 */
'use strict';
import angular from 'angular';
import amPM from '../../filters/ampm/ampm.filter';
import weekday from '../../filters/weekday/weekday.filter';

export class ScheduleManagerController {
  /*@ngInject*/
  constructor($http, $uibModal) {
    this.$http = $http;
    this.$uibModal = $uibModal;
  }

  $onInit() {
    this.$http.get('/api/schedule?flat=true')
      .then(response => {
        this.scheduleItems = response.data;
        return null;
      });
    this.submitted = false;
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

export default angular.module('shyApp.schedulemanager', [amPM, weekday])
  .component('schedulemanager', {
    template: require('./schedulemanager.pug'),
    controller: ScheduleManagerController
  })
  .name;
