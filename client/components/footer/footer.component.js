import angular from 'angular';

export class FooterController {}

export default angular.module('directives.footer', [])
  .component('footer', {
    template: require('./footer.pug'),
    controller: FooterController
  })
  .name;
