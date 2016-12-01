'use strict';
import angular from 'angular';

export function htmlIdFilter() {
  return input => input.toLowerCase()
    .split(' ')
    .join('');
}

export default angular.module('shyApp.htmlId', [])
  .filter('htmlid', htmlIdFilter)
  .name;
