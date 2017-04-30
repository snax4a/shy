'use strict';
import angular from 'angular';

export function nosubsFilter() {
  // Use ES6 filter
  return items => items.filter(item => !item.substitute);
}

export default angular.module('shyApp.nosubs', [])
  .filter('nosubs', nosubsFilter)
  .name;
