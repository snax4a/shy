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

  localISODate(date) {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
    return (new Date(date - tzoffset)).toISOString()
      .substring(0, 10);
  }

  showCalendar() {
    this.datePickerOpened = true;
  }

  attendeeLookup() {
    if(!!this.classDate && !!this.location && !!this.classTitle && !!this.teacher) {
      const localISODate = this.localISODate(this.classDate);
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
        this.user = {
          _id: attendee.UserId,
          ts: new Date().getTime() // forces user to be different even if _id is not
        };
        this.attendees.splice(this.attendees.indexOf(attendee), 1); // Remove attendee from array
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
