export class ClassesComponent {
  /*@ngInject*/
  constructor($anchorScroll, $timeout, ClassesService) {
    this.$anchorScroll = $anchorScroll;
    this.$timeout = $timeout;
    this.ClassesService = ClassesService;
  }

  $onInit() {
    this.classSchedule = this.ClassesService.classSchedule;
    this.classes = this.ClassesService.classes;
    this.$timeout(this.$anchorScroll, 100);
  }
}
