'use strict';

export class TeachersComponent {
  /*@ngInject*/
  constructor($anchorScroll, $timeout, TeachersService) {
    this.$anchorScroll = $anchorScroll;
    this.$timeout = $timeout;
    this.teachersService = TeachersService;
  }

  $onInit() {
    this.faculty = this.teachersService.teachers;
    this.$timeout(this.$anchorScroll, 50);
  }
}
