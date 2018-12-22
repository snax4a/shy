'use strict';

export class HomeComponent {
  /*@ngInject*/
  constructor(HomeService) {
    this.HomeService = HomeService;
  }

  $onInit() {
    this.announcementList = this.HomeService.announcementList;
    this.faqs = this.HomeService.faqs;
    this.slides = this.HomeService.slides;
  }
}
