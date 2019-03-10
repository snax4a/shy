// Note: if any picklists ever fail to load, may need to have admin component wait for Classes, Teachers, and Location service to initialize
export class ScheduleEditorController {
  /*@ngInject*/
  constructor($timeout, $uibModalInstance, scheduleItemBeforeEdits, teachers, ClassService, classes, locations) {
    // Dependencies
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.scheduleItemBeforeEdits = scheduleItemBeforeEdits;
    this.teachers = teachers;
    this.classService = ClassService;
    this.classes = classes;
    this.locations = locations;

    // Initializations - not in $onInit since not it's own component
    this.errors = {};
    this.weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.submitted = false;
    this.scheduleItem = { ...this.scheduleItemBeforeEdits };
    this.options = {
      timeSecondsFormat: 'ss',
      timeStripZeroSeconds: true
    };
  }

  // Reset server-side error status
  clearServerError(form, fieldName) {
    form[fieldName].$setValidity('server', true);
  }

  submitScheduleItem(form) {
    this.submitted = true;
    if(form.$valid) {
      this.classService.scheduleItemUpsert(this.scheduleItem)
        .then(id => {
          this.scheduleItem._id = id;

          // Update looked up names for list so we don't need to refresh the page
          const thisTeacher = this.teachers.find(x => x._id === this.scheduleItem.teacher_id);
          this.scheduleItem.teacher = `${thisTeacher.firstName} ${thisTeacher.lastName}`;
          const thisLocation = this.locations.find(x => x._id === this.scheduleItem.location_id);
          this.scheduleItem.location = thisLocation.name;
          const thisClass = this.classes.find(x => x._id === this.scheduleItem.class_id);
          this.scheduleItem.title = thisClass.name;

          // Graft the edited scheduled item back the original
          Object.assign(this.scheduleItemBeforeEdits, this.scheduleItem);
          return this.$uibModalInstance.close();
        })
        .catch(response => {
          const { errors } = response.data;
          // Update validity of form fields that match the server errors
          for(let error of errors) {
            form[error.path].$setValidity('server', false);
            this.errors[error.path] = error.message;
          }
          this.$timeout(() => true);
        });
    }
  }

  cancel() {
    if(!this.scheduleItemBeforeEdits._id) {
      this.scheduleItemBeforeEdits.shouldBeDeleted = true;
    }
    this.$uibModalInstance.close();
  }
}
