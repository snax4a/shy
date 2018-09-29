'use strict';
import angular from 'angular';
import ngRoute from 'angular-route';
import routes from './shynet.routes';
import datepickerPopup from 'angular-ui-bootstrap/src/datepickerPopup/index-nocss.js';
import UserManager from '../../components/usermanager/usermanager.component';

export class SHYnetController {
  /*@ngInject*/
  constructor($http, $uibModal) {
    this.$http = $http;
    this.$uibModal = $uibModal;
  }

  $onInit() {
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
    this.classDate = new Date();
    this.datePickerOpened = false;
    this.dateOptions = {
      dateDisabled: false,
      formatYear: 'yyyy',
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(2018, 1, 1),
      startingDay: 1
    };
    this.submitted = false;
    this.attendees = [];
  }

  showCalendar() {
    this.datePickerOpened = true;
  }

  attendeeLookup() {
    if(!!this.classDate && !!this.location && !!this.classTitle && !!this.teacher) {
      const tzoffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
      const localISODate = (new Date(this.classDate - tzoffset)).toISOString().substring(0, 10);
      this.$http.get(`/api/history/attendees/?attended=${localISODate}&location=${encodeURI(this.location)}&teacher=${encodeURI(this.teacher)}&classTitle=${encodeURI(this.classTitle)}`)
        .then(response => {
          this.attendees = response.data;
          return null;
        });
    }
  }

  attendeeDelete(attendee) {
    this.$http.delete(`/api/history/${attendee._id}?type=A`)
      .then(() => {
        this.attendees.splice(this.attendees.indexOf(attendee), 1); // Remove attendee from array
        this.user = attendee.UserId; // Trigger $onChanges in child
        console.log('Parent should have triggered $onChanges in child');
        return null;
      })
      .catch(response => {
        console.log('Error', response);
        return null;
      });
  }
}

export default angular.module('shyApp.shynet', [ngRoute, datepickerPopup, UserManager])
  .config(routes)
  .component('shynet', {
    template: require('./shynet.pug'),
    controller: SHYnetController
  })
  .name;
