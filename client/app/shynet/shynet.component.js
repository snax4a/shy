'use strict';
import angular from 'angular';

export class SHYnetComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'World';
  }
}

export default angular.module('shyApp.shynet', [])
  .component('shynet', {
    template: '<h1>Hello {{ $ctrl.message }}</h1>',
    bindings: { message: '<' },
    controller: SHYnetComponent
  })
  .name;
