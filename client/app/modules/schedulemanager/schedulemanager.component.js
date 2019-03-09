import { ScheduleEditorController } from './scheduleeditor.controller';

export class ScheduleManagerComponent {
  /*@ngInject*/
  constructor($timeout, $uibModal, ClassService, TeacherService, LocationService) {
    this.$timeout = $timeout; // Pull async function results into digest cycle
    this.$uibModal = $uibModal;
    this.classService = ClassService;
    this.teacherService = TeacherService;
    this.locationService = LocationService;
  }

  async $onInit() {
    this.scheduleItems = await this.classService.scheduleGet(true);
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
        scheduleItemBeforeEdits: () => scheduleItem,
        teachers: () => this.teacherService.teachers,
        classes: () => this.classService.classes,
        locations: () => this.locationService.locations
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
    const today = new Date();
    const defaultTime = new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours());
    let scheduleItem = {
      _id: 0,
      location_id: 1,
      day: today.getDay() + 1,
      teacher_id: undefined, //29738,
      class_id: 1,
      startTime: defaultTime,
      endTime: defaultTime,
      canceled: false
    };

    this.scheduleItems.unshift(scheduleItem);
    this.modalScheduleEditor(scheduleItem);
  }

  async scheduleItemDelete(selectedScheduleItem) {
    await this.classService.scheduleItemDelete(selectedScheduleItem);
    this.$timeout(() => this.scheduleItemRemoveFromList(selectedScheduleItem));
  }
}
