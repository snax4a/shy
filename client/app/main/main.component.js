import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './main.routes';

export class MainController {

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.slides = [
      { src: '/assets/images/home/closeup1.jpg' },
      { src: '/assets/images/home/closeup2.jpg' },
      { src: '/assets/images/home/closeup3.jpg' },
      { src: '/assets/images/home/closeup4.jpg' }
    ];
  }

  $onInit() {
    this.$http.get('/assets/data/announcements.json')
      .then(response => {
        this.data = response.data;
      });
  }
}

export default angular.module('shyApp.main', [uiRouter])
  .config(routes)
  .component('main', {
    template: require('./main.pug'),
    controller: MainController
  })
  .name;
