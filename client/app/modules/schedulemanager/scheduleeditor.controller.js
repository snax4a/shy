'use strict';

import angular from 'angular'; // angular copy

// Note: if any picklists ever fail to load, may need to have admin component wait for Classes, Teachers, and Location service to initialize
export class ScheduleEditorController {
  /*@ngInject*/
  constructor($uibModalInstance, scheduleItemSelectedForEditing, ClassesService, TeachersService, LocationsService) {
    // Dependencies
    this.$uibModalInstance = $uibModalInstance;
    this.scheduleItemSelectedForEditing = scheduleItemSelectedForEditing;
    this.classesService = ClassesService;
    this.teachersService = TeachersService;
    this.locationsService = LocationsService;

    // Initializations - not in $onInit since not it's own component
    this.weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.submitted = false;
    this.errors = {};
    this.scheduleItem = {};

    angular.copy(this.scheduleItemSelectedForEditing, this.scheduleItem);
  }

  async submitScheduleItem(form) {
    this.submitted = true;
    if(form.$valid) {
      // Make a copy of this.user or upsert fails
      let upsertedScheduleItem = {};
      angular.copy(this.scheduleItem, upsertedScheduleItem);

      // Set _id to generated one (for inserts) or existing (for updates)
      upsertedScheduleItem._id = await this.classesService.scheduleItemUpsert(upsertedScheduleItem);

      // Graft the edited scheduled item back the original
      angular.extend(this.scheduleItemSelectedForEditing, upsertedScheduleItem);
      this.$uibModalInstance.close();

      // Successful - return promise
      return true;
    }
  }

  cancel() {
    if(!this.scheduleItemSelectedForEditing._id) {
      this.scheduleItemSelectedForEditing.shouldBeDeleted = true;
    }
    this.$uibModalInstance.close();
  }
}
