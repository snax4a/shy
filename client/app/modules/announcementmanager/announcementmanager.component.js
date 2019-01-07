import { AnnouncementEditorController } from './announcementeditor.controller';

export class AnnouncementManagerComponent {
  /*@ngInject*/
  constructor($timeout, $uibModal, AnnouncementService) {
    this.$timeout = $timeout; // calling digest cycle in async functions
    this.announcementService = AnnouncementService;
    this.$uibModal = $uibModal;
  }

  $onInit() {
    this.announcementsGet();
    this.submitted = false;
  }

  announcementRemoveFromList(announcement) {
    this.announcements.splice(this.announcements.indexOf(announcement), 1);
  }

  announcementCreate() {
    // Expire next month
    let defaultExpiration = new Date();
    defaultExpiration.setDate(defaultExpiration.getDate() + 30);
    let announcement = {
      _id: 0,
      section: '',
      title: '',
      description: '',
      expires: defaultExpiration
    };

    this.announcements.unshift(announcement);
    this.modalAnnouncementEditor(announcement);
  }

  async announcementDelete(announcement) {
    await this.announcementService.announcementDelete(announcement);
    this.$timeout(() => this.announcementRemoveFromList(announcement));
  }

  announcementEdit(announcement) {
    this.modalAnnouncementEditor(announcement);
  }

  async announcementsGet() {
    this.announcements = await this.announcementService.announcementsGet(true);
  }

  modalAnnouncementEditor(announcement) {
    let modalDialog = this.$uibModal.open({
      template: require('./announcementeditor.pug'),
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: AnnouncementEditorController,
      resolve: {
        announcementSelectedForEditing: () => announcement
      }
    });
    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(() => {
      if(announcement.shouldBeDeleted) this.announcementRemoveFromList(announcement);
    });
  }
}
