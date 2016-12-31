import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './main.routes';
import announcementList from '../../assets/data/announcements.json';
import faqs from '../../assets/data/faqs.json';

export class MainController {

  /*@ngInject*/
  constructor() {
    this.announcementList = [];
    this.faqs = [];
    this.slides = [
      { src: '/assets/images/home/closeup1.jpg' },
      { src: '/assets/images/home/closeup2.jpg' },
      { src: '/assets/images/home/closeup3.jpg' },
      { src: '/assets/images/home/closeup4.jpg' }
    ];
  }

  $onInit() {
    // Load announcements from JSON file
    this.announcementList = announcementList;
    this.faqs = faqs;
  }
}

export default angular.module('shyApp.main', [uiRouter])
  .config(routes)
  .component('main', {
    template: require('./main.pug'),
    controller: MainController
  })
  .name;
