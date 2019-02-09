export class TeachersComponent {
  /*@ngInject*/
  constructor($anchorScroll, $timeout, TeacherService) {
    this.$anchorScroll = $anchorScroll;
    this.$timeout = $timeout;
    this.teacherService = TeacherService;
  }

  $onInit() {
    this.faculty = this.teacherService.teachers;
    this.$timeout(this.$anchorScroll, 100);
  }
}
