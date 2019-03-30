import ClassDescriptionModalController from './classdescriptionmodal.controller';
import TeacherModalController from './teachermodal.controller';

export class ClassesComponent {
  /*@ngInject*/
  constructor($anchorScroll, $timeout, $uibModal, ClassService, LocationService) {
    this.$anchorScroll = $anchorScroll;
    this.$timeout = $timeout;
    this.$uibModal = $uibModal;
    this.classService = ClassService;
    this.locationService = LocationService;
  }

  $onInit() {
    this.classSchedule = this.classService.classScheduleNested;
    this.locations = this.locationService.locations;
    this.$timeout(this.$anchorScroll, 100);
  }

  // Use UI-Bootstrap to open a modal
  classDescriptionOpen(title, description) {
    let modalDialog = this.$uibModal.open({
      template: require('./classdescriptionmodal.pug'),
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: ClassDescriptionModalController,
      resolve: {
        title: () => title,
        description: () => description
      }
    });

    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(() => {
    }, () => {
      console.log('Backdrop click');
    });
  }

  // Use UI-Bootstrap to open a modal
  teacherOpen(firstName, lastName, imageId, bio, url) {
    let modalDialog = this.$uibModal.open({
      template: require('./teachermodal.pug'),
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: TeacherModalController,
      resolve: {
        firstName: () => firstName,
        lastName: () => lastName,
        imageId: () => imageId,
        bio: () => bio,
        url: () => url,
      }
    });

    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(() => {
    }, () => {
      console.log('Backdrop click');
    });
  }
}
