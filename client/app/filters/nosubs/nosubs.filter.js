'use strict';
import angular from 'angular';

export function nosubsFilter() {
  // Use ES6 filter
  return items => {
    if(items === undefined) items = []; // in case there's no data back yet
    return items.filter(item => !item.substitute);
  };
}

export default angular.module('shyApp.nosubs', [])
  .filter('nosubs', nosubsFilter)
  .name;
