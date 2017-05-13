'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './shynet.routes';
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
      minDate: new Date(),
      startingDay: 1
    };
    this.submitted = false;
  }

  showCalendar() {
    this.datePickerOpened = true;
  }
}

export default angular.module('shyApp.shynet', [uiRouter, UserManager])
  .config(routes)
  .component('shynet', {
    template: require('./shynet.pug'),
    controller: SHYnetController
  })
  .name;
