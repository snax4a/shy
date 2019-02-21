export class HomeService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.initialized = this.initialize(); // promise used by route
  }

  async initialize() {
    try {
      await this.getFaqs();
      this.getSlides(); // synchronous
      return true;
    } catch(err) {
      return false;
    }
  }

  async getFaqs() {
    const { data } = await this.$http.get('/assets/data/faqs.json');
    this.faqs = data;
    return this.faqs;
  }

  getSlides() {
    this.slides = [
      { src: '/assets/images/home1.jpg' },
      { src: '/assets/images/home2.jpg' },
      { src: '/assets/images/home3.jpg' },
      { src: '/assets/images/home4.jpg' }
    ];
    return this.slides;
  }
}
