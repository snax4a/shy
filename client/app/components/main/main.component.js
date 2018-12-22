import angular from 'angular';
import ngRoute from 'angular-route';
import routes from './main.routes';
import UibCarouselDirective from 'angular-ui-bootstrap/src/carousel/index-nocss.js';

export class MainComponent {
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

export default angular.module('shyApp.main', [ngRoute, UibCarouselDirective])
  .config(routes)
  .component('main', {
    template: require('./main.pug'),
    controller: MainComponent
  })
  .name;
