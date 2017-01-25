'use strict';
import angular from 'angular';

export function htmlIdFilter() {
  return input => input.replace(/[\W_]+/g, '').toLowerCase();
}

export default angular.module('shyApp.htmlId', [])
  .filter('htmlid', htmlIdFilter)
  .name;
