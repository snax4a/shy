'use strict';

export class HomeService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.initialized = this.initialize(); // promise used by route
  }

  async initialize() {
    try {
      await Promise.all([this.getAnnouncements(), this.getFaqs()]);
      this.getSlides(); // synchronous
      return true;
    } catch(err) {
      return false;
    }
  }

  async getAnnouncements() {
    const { data } = await this.$http.get('/api/announcement');
    this.announcementList = data;
  }

  async getFaqs() {
    const { data } = await this.$http.get('/assets/data/faqs.json');
    this.faqs = data;
    return this.faqs;
  }

  getSlides() {
    this.slides = [
      { src: '/assets/images/home/closeup1.jpg' },
      { src: '/assets/images/home/closeup2.jpg' },
      { src: '/assets/images/home/closeup3.jpg' },
      { src: '/assets/images/home/closeup4.jpg' }
    ];
    return this.slides;
  }
}
