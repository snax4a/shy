'use strict';
import angular from 'angular';

/*@ngInject*/
export function upcomingFilter() {
  return input => {
    if(input === undefined) return false;
    return input.filter(function(item) {
      if(item.expires === null) return false;
      const today = new Date();
      const inputUpcoming = new Date(item.expires);
      return inputUpcoming > today;
    });
  };
}

export default angular.module('shyApp.upcoming', [])
  .filter('upcoming', upcomingFilter)
  .name;
