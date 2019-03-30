import { ClassEditorController } from './classeditor.controller';

export class ClassManagerComponent {
  /*@ngInject*/
  constructor($timeout, $uibModal, ClassService) {
    this.$timeout = $timeout; // calling digest cycle in async functions
    this.classService = ClassService;
    this.$uibModal = $uibModal;
  }

  $onInit() {
    this.alerts = [];
    this.classesGet();
    this.submitted = false;
  }

  // close the alert by deleting the element in the array
  closeAlert(index) {
    this.alerts.splice(index, 1);
  }

  classRemoveFromList(thisClass) {
    this.classes.splice(this.classes.indexOf(thisClass), 1);
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
    try {
      await this.classService.classDelete(thisClass);
      this.$timeout(() => this.classRemoveFromList(thisClass));
    } catch(err) {
      if(err.statusText.includes('fkey')) {
        this.$timeout(() => this.alerts.push({ type: 'alert-danger', message: `${thisClass.name} cannot be deleted unless there are no schedules or attendances using it.`}));
      }
    }
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
      backdrop: false, // else mouseup outside of box dismisses dialog
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: ClassEditorController,
      resolve: {
        classBeforeEdits: () => thisClass
      }
    });
    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(() => {
      if(thisClass.shouldBeDeleted) this.classRemoveFromList(thisClass);
    });
  }
}
