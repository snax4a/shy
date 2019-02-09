import angular from 'angular'; // angular copy

// Note: if any picklists ever fail to load, may need to have admin component wait for Classes, Teachers, and Location service to initialize
export class ScheduleEditorController {
  /*@ngInject*/
  constructor($uibModalInstance, scheduleItemSelectedForEditing, ClassService, TeacherService, LocationService) {
    // Dependencies
    this.$uibModalInstance = $uibModalInstance;
    this.scheduleItemSelectedForEditing = scheduleItemSelectedForEditing;
    this.classService = ClassService;
    this.teacherService = TeacherService;
    this.locationService = LocationService;

    // Initializations - not in $onInit since not it's own component
    this.weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.submitted = false;
    this.errors = {};
    this.scheduleItem = {};
    this.options = {
      timeSecondsFormat: 'ss',
      timeStripZeroSeconds: true,
      timezone: 'UTC'
    };

    angular.copy(this.scheduleItemSelectedForEditing, this.scheduleItem);
  }

  async submitScheduleItem(form) {
    this.submitted = true;
    if(form.$valid) {
      // Make a copy of this.user or upsert fails
      let upsertedScheduleItem = {};
      angular.copy(this.scheduleItem, upsertedScheduleItem);

      // Set _id to generated one (for inserts) or existing (for updates)
      upsertedScheduleItem._id = await this.classService.scheduleItemUpsert(upsertedScheduleItem);

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
