import angular from 'angular';

export class FooterController {}

export default angular.module('shyApp.footer', [])
  .component('footer', {
    template: require('./footer.pug'),
    controller: FooterController
  })
  .name;
