import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './main.routes';
import announcementsJson from '../../assets/data/announcements.json';

export class MainController {

  /*@ngInject*/
  constructor() {
    this.data = [];
    this.slides = [
      { src: '/assets/images/home/closeup1.jpg' },
      { src: '/assets/images/home/closeup2.jpg' },
      { src: '/assets/images/home/closeup3.jpg' },
      { src: '/assets/images/home/closeup4.jpg' }
    ];
  }

  $onInit() {
    // Load announcements from JSON file
    this.data = announcementsJson;
  }
}

export default angular.module('shyApp.main', [uiRouter])
  .config(routes)
  .component('main', {
    template: require('./main.pug'),
    controller: MainController
  })
  .name;
