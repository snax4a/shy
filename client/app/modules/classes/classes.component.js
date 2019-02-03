export class ClassesComponent {
  /*@ngInject*/
  constructor($anchorScroll, $timeout, ClassesService) {
    this.$anchorScroll = $anchorScroll;
    this.$timeout = $timeout;
    this.ClassesService = ClassesService;
  }

  $onInit() {
    this.classes = this.ClassesService.classes;
    this.classSchedule = this.ClassesService.classSchedule;
    this.$timeout(this.$anchorScroll, 100);
  }
}
