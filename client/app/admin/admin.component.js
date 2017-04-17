'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './admin.routes';
import ngResource from 'angular-resource'; // delete() relies on this
import AuthModule from '../../components/auth/auth.module';
import teachers from '../../assets/data/teachers.json';
import classes from '../../assets/data/classes.json';
import locations from '../../assets/data/locations.json';

export class AdminController {
  /*@ngInject*/
  constructor($http, User, $uibModal) {
    this.$http = $http;
    this.User = User;
    this.$uibModal = $uibModal;
  }

  $onInit() {
    this.users = [];
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
    this.reverse = false;
    this.sortKey = 'lastName';
    this.submitted = false;
  }

  searchUsers(form) {
    this.submitted = true;

    if(form.$valid) {
      this.User.query({ filter: this.filterField})
        .$promise
        .then(users => {
          this.users = users;
        });
    }
  }

  deleteUser(selectedUser) {
    selectedUser.$remove({ id: selectedUser._id }); // Delete the user from the server
    this.users.splice(this.users.indexOf(selectedUser), 1); // Remove them from the array
  }

  modalUserEditor(user) {
    let modalDialog = this.$uibModal.open({
      template: require('./usereditor.pug'),
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: UserEditorController,
      resolve: {
        userSelectedForEditing: () => user
      }
    });

    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(() => {
      if(user.shouldBeDeleted) this.users.splice(this.users.indexOf(user), 1); // Remove them from the array
    });
  }

  editUser(user) {
    this.modalUserEditor(user);
  }

  createUser() {
    let user = {
      _id: 0,
      provider: 'local',
      role: 'student',
      optOut: false
    };

    this.users.unshift(user);
    this.modalUserEditor(user);
  }

  sortUsers(keyname) {
    this.sortKey = keyname;
    this.reverse = !this.reverse;
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

class UserEditorController {
  /*@ngInject*/
  constructor($uibModalInstance, userSelectedForEditing, User) {
    // Dependencies
    this.$uibModalInstance = $uibModalInstance;
    this.userSelectedForEditing = userSelectedForEditing;
    this.User = User;

    // Initializations - not in $onInit since not it's own component
    this.submitted = false;
    this.errors = {};
    this.user = {};
    angular.copy(this.userSelectedForEditing, this.user);
  }

  clearServerError(form, fieldName) {
    form[fieldName].$setValidity('server', true);
  }

  submitUser(form) {
    this.submitted = true;
    if(form.$valid) {
      // Make a copy of this.user or upsert fails
      let upsertedUser = {};
      angular.copy(this.user, upsertedUser);
      this.User.upsert(upsertedUser)
        .$promise
        .then(user => { // only contains user._id
          // Do not add the password and passwordConfirm to the array
          Reflect.deleteProperty(upsertedUser, 'password'); // clear this out for security reasons
          Reflect.deleteProperty(upsertedUser, 'passwordConfirm'); // ditto

          // If a new user...
          if(upsertedUser._id === 0) {
            upsertedUser._id = user._id;
          }

          // Graft the edited user back the original
          angular.extend(this.userSelectedForEditing, upsertedUser);
          this.$uibModalInstance.close();
          return null;
        })
        .catch(response => {
          let err = response.data;
          this.errors = {}; // reset to only the latest errors

          // Update validity of form fields that match the server errors
          if(err.name) {
            for(let error of err.errors) {
              form[error.path].$setValidity('server', false);
              this.errors[error.path] = error.message;
            }
          }
          return null;
        });
    }
  }

  cancel() {
    if(!this.userSelectedForEditing._id) {
      this.userSelectedForEditing.shouldBeDeleted = true;
    }
    this.$uibModalInstance.close();
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
    this.teachers = teachers;
    this.classes = classes;
    this.locations = locations;
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

export default angular.module('shyApp.admin', [uiRouter, AuthModule, ngResource])
  .config(routes)
  .component('admin', {
    template: require('./admin.pug'),
    controller: AdminController
  })
  .name;
