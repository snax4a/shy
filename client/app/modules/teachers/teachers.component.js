'use strict';

export class TeachersComponent {
  /*@ngInject*/
  constructor($anchorScroll, $timeout, TeachersService) {
    this.$anchorScroll = $anchorScroll;
    this.$timeout = $timeout;
    this.TeachersService = TeachersService;
  }

  async $onInit() {
    this.faculty = await this.TeachersService.teachers;
    this.$timeout(this.$anchorScroll, 50);
  }
}
