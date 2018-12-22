'use strict';

export class ClassesComponent {
  /*@ngInject*/
  constructor(ClassesService) {
    this.ClassesService = ClassesService;
  }

  $onInit() {
    this.classes = this.ClassesService.classes;
    this.classSchedule = this.ClassesService.classSchedule;
  }
}
