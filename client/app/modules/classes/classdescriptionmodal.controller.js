export default class ClassDescriptionModalController {
  /*@ngInject*/
  constructor($uibModalInstance, title, description) {
    this.$uibModalInstance = $uibModalInstance;
    this.title = title;
    this.description = description;
  }

  cancel() {
    this.$uibModalInstance.close();
  }
}
