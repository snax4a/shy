'use strict';
import angular from 'angular';

export function upcomingFilter() {
  return items => {
    let filtered = [];
    if(items !== undefined) {
      for(let item of items) {
        if(item.expires !== null && new Date(item.expires) > new Date()) {
          filtered.push(item);
        }
      }
    }
    return filtered;
  };
}

export default angular.module('shyApp.upcoming', [])
  .filter('upcoming', upcomingFilter)
  .name;
