'use strict';
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
    const now = new Date();
    // Expire next month (and omit time)
    let defaultExpiration = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
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
