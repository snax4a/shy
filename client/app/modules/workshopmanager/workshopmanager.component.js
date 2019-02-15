import { WorkshopEditorController } from './workshopeditor.controller';

export class WorkshopManagerComponent {
  /*@ngInject*/
  constructor($timeout, $uibModal, WorkshopService) {
    this.$timeout = $timeout; // Pull async function results into digest cycle
    this.$uibModal = $uibModal;
    this.workshopService = WorkshopService;
  }

  async $onInit() {
    this.workshops = [];
    this.workshopsGet();
    this.submitted = false;
    return true;
  }

  async workshopsGet() {
    this.workshops = await this.workshopService.workshopsGet();
  }

  modalWorkshopEditor(workshop) {
    let modalDialog = this.$uibModal.open({
      template: require('./workshopeditor.pug'),
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: WorkshopEditorController,
      resolve: {
        workshopSelectedForEditing: () => workshop
      }
    });
    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(() => {
      if(workshop.shouldBeDeleted) this.workshops.splice(this.workshops.indexOf(workshop), 1); // Remove them from the array
    });
  }

  workshopEdit(workshop) {
    this.modalWorkshopEditor(workshop);
  }

  workshopRemoveFromList(workshop) {
    this.workshops.splice(this.workshops.indexOf(workshop), 1);
  }

  workshopCreate() {
    let workshop = {
      _id: 0
    };

    this.workshops.unshift(workshop);
    this.modalWorkshopEditor(workshop);
  }

  async workshopDelete(workshop) {
    await this.workshopService.workshopDelete(workshop);
    this.$timeout(() => this.workshopRemoveFromList(workshop));
  }
}
