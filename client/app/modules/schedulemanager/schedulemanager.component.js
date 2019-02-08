import { ScheduleEditorController } from './scheduleeditor.controller';

export class ScheduleManagerComponent {
  /*@ngInject*/
  constructor($timeout, $uibModal, ClassesService) {
    this.$timeout = $timeout; // Pull async function results into digest cycle
    this.$uibModal = $uibModal;
    this.classesService = ClassesService;
  }

  async $onInit() {
    this.scheduleItems = await this.classesService.scheduleGet(true);
    this.submitted = false;
    return true;
  }

  modalScheduleEditor(scheduleItem) {
    let modalDialog = this.$uibModal.open({
      template: require('./scheduleeditor.pug'),
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: ScheduleEditorController,
      resolve: {
        scheduleItemSelectedForEditing: () => scheduleItem
      }
    });
    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(() => {
      if(scheduleItem.shouldBeDeleted) this.scheduleItems.splice(this.scheduleItems.indexOf(scheduleItem), 1); // Remove them from the array
    });
  }

  scheduleItemEdit(scheduleItem) {
    this.modalScheduleEditor(scheduleItem);
  }

  scheduleItemRemoveFromList(scheduleItem) {
    this.scheduleItems.splice(this.scheduleItems.indexOf(scheduleItem), 1);
  }

  scheduleItemCreate() {
    let scheduleItem = {
      _id: 0,
      location: 'Squirrel Hill',
      day: 1,
      teacher: 'Leta Koontz',
      title: 'Ashtanga Yoga',
      startTime: new Date(),
      endTime: new Date(),
      canceled: false
    };

    this.scheduleItems.unshift(scheduleItem);
    this.modalScheduleEditor(scheduleItem);
  }

  async scheduleItemDelete(selectedScheduleItem) {
    await this.classesService.scheduleItemDelete(selectedScheduleItem);
    this.$timeout(() => this.scheduleItemRemoveFromList(selectedScheduleItem));
  }
}
