// Note: if any picklists ever fail to load, may need to have admin component wait for Classes, Teachers, and Location service to initialize
export class ScheduleEditorController {
  /*@ngInject*/
  constructor($uibModalInstance, scheduleItemBeforeEdits, ClassService, TeacherService, LocationService) {
    // Dependencies
    this.$uibModalInstance = $uibModalInstance;
    this.scheduleItemBeforeEdits = scheduleItemBeforeEdits;
    this.classService = ClassService;
    this.teacherService = TeacherService;
    this.locationService = LocationService;

    // Initializations - not in $onInit since not it's own component
    this.weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.submitted = false;
    this.scheduleItem = { ...this.scheduleItemBeforeEdits };
    this.options = {
      timeSecondsFormat: 'ss',
      timeStripZeroSeconds: true,
      timezone: 'UTC'
    };
  }

  async submitScheduleItem(form) {
    this.submitted = true;
    if(form.$valid) {
      // Set _id to generated one (for inserts) or existing (for updates)
      this.scheduleItem._id = await this.classService.scheduleItemUpsert(this.scheduleItem);

      // Graft the edited scheduled item back the original
      Object.assign(this.scheduleItemBeforeEdits, this.scheduleItem);
      this.$uibModalInstance.close();

      // Successful - return promise
      return true;
    }
  }

  cancel() {
    if(!this.scheduleItemBeforeEdits._id) {
      this.scheduleItemBeforeEdits.shouldBeDeleted = true;
    }
    this.$uibModalInstance.close();
  }
}
