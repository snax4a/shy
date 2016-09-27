'use strict';
const angular = require('angular');

/*@ngInject*/
export function htmlIdFilter() {
  return function(input) {
    return input.toLowerCase()
    .split(' ')
    .join('');
  };
}

export default angular.module('shyApp.htmlId', [])
  .filter('htmlid', htmlIdFilter)
  .name;
