'use strict';
const angular = require('angular');

/*@ngInject*/
export function upcomingFilter() {
  return function(input) {
    if(input === undefined) return false;
    return input.filter(function(item) {
      if(item.expires === null) return false;
      var today = new Date();
      var inputUpcoming = new Date(item.expires);
      return inputUpcoming > today;
    });
  };
}

export default angular.module('shyApp.upcoming', [])
  .filter('upcoming', upcomingFilter)
  .name;
