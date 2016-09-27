'use strict';
/* eslint no-sync: 0 */

import angular from 'angular';

export class BannerComponent {}

export default angular.module('directives.banner', [])
  .component('banner', {
    template: require('./banner.pug'),
    controller: BannerComponent
  })
  .name;
