export class HomeComponent {
  /*@ngInject*/
  constructor(AnnouncementService, HomeService) {
    this.announcementService = AnnouncementService;
    this.homeService = HomeService;
  }

  $onInit() {
    this.announcementList = this.announcementService.announcementList;
    this.faqs = this.homeService.faqs;
    this.slides = this.homeService.slides;
  }
}
