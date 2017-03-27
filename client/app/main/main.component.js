import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './main.routes';
import faqs from '../../assets/data/faqs.json';

export class MainController {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    this.$http.get('/api/announcement')
      .then(response => {
        this.announcementList = response.data;
        return null;
      });
    this.faqs = [];
    this.slides = [
      { src: '/assets/images/home/closeup1.jpg' },
      { src: '/assets/images/home/closeup2.jpg' },
      { src: '/assets/images/home/closeup3.jpg' },
      { src: '/assets/images/home/closeup4.jpg' }
    ];
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
