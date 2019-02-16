export class ClassEditorController {
  /*@ngInject*/
  constructor($uibModalInstance, ClassService, classSelectedForEditing) {
    // Dependencies
    this.$uibModalInstance = $uibModalInstance;
    this.classService = ClassService;
    this.classSelectedForEditing = classSelectedForEditing;

    // Initializations - not in $onInit since not it's own component
    this.submitted = false;
    this.errors = {};
    this.class = { ...this.classSelectedForEditing };
  }

  async submitClass(form) {
    this.submitted = true;
    if(form.$valid) {
      // Make a copy of this.user or upsert fails
      let upsertedClass = { ...this.class };
      upsertedClass._id = await this.classService.classUpsert(upsertedClass);

      // Graft the edited class back the original
      Object.assign(this.classSelectedForEditing, upsertedClass);

      this.$uibModalInstance.close();

      // Success
      return true;
    }
  }

  cancel() {
    if(!this.classSelectedForEditing._id) {
      this.classSelectedForEditing.shouldBeDeleted = true;
    }
    this.$uibModalInstance.close();
  }
}
