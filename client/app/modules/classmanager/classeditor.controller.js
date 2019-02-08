import angular from 'angular'; // for angular.copy

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
    this.class = {};
    angular.copy(this.classSelectedForEditing, this.class);
  }

  async submitProduct(form) {
    this.submitted = true;
    if(form.$valid) {
      // Make a copy of this.user or upsert fails
      let upsertedClass = {};
      angular.copy(this.class, upsertedClass);

      upsertedClass._id = await this.productService.productUpsert(upsertedClass);

      // Graft the edited product back the original
      angular.extend(this.classSelectedForEditing, upsertedClass);
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
