import { ClassEditorController } from './classeditor.controller';

export class ClassManagerComponent {
  /*@ngInject*/
  constructor($timeout, $uibModal, ClassService) {
    this.$timeout = $timeout; // calling digest cycle in async functions
    this.classService = ClassService;
    this.$uibModal = $uibModal;
  }

  $onInit() {
    this.classesGet();
    this.submitted = false;
  }

  classRemoveFromList(thisClass) {
    this.classes.splice(this.class.indexOf(thisClass), 1);
  }

  classCreate() {
    let thisClass = {
      _id: 0,
      name: '',
      description: '',
      active: true
    };

    this.classes.unshift(thisClass);
    this.modalClassEditor(thisClass);
  }

  async classDelete(thisClass) {
    await this.classService.classDelete(thisClass);
    this.$timeout(() => this.classRemoveFromList(thisClass));
  }

  classEdit(thisClass) {
    this.modalClassEditor(thisClass);
  }

  async classesGet() {
    this.classes = await this.classService.classesGet();
  }

  modalClassEditor(thisClass) {
    let modalDialog = this.$uibModal.open({
      template: require('./classeditor.pug'),
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: ClassEditorController,
      resolve: {
        classSelectedForEditing: () => thisClass
      }
    });
    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(() => {
      if(thisClass.shouldBeDeleted) this.classRemoveFromList(thisClass);
    });
  }
}
