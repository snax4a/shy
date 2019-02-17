export class ClassEditorController {
  /*@ngInject*/
  constructor($timeout, $uibModalInstance, ClassService, classBeforeEdits) {
    // Dependencies
    this.$timeout = $timeout; // force digest cycle for error messages
    this.$uibModalInstance = $uibModalInstance;
    this.classService = ClassService;
    this.classBeforeEdits = classBeforeEdits;

    // Initializations - not in $onInit since not it's own component
    this.submitted = false;
    this.errors = {};
    this.class = { ...this.classBeforeEdits };
  }

  async submitClass(form) {
    this.submitted = true;
    if(form.$valid) {
      try {
        this.class._id = await this.classService.classUpsert(this.class);
        // Graft the edited class back the original
        Object.assign(this.classBeforeEdits, this.class);

        this.$uibModalInstance.close();

        // Success
        return true;
      } catch(err) {
        this.$timeout(() => {
          form.className.$setValidity('server', false);
          this.errors.className = 'That class name is already being used. Please choose another.';
        });
      }
    }
  }

  // Reset server-side error status
  clearServerError(form, fieldName) {
    form[fieldName].$setValidity('server', true);
  }

  cancel() {
    if(!this.classBeforeEdits._id) {
      this.classBeforeEdits.shouldBeDeleted = true;
    }
    this.$uibModalInstance.close();
  }
}
