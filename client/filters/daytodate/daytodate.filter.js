'use strict';
const angular = require('angular');

/*@ngInject*/
export function dayToDateFilter() {
  return function(input) {
    // Converts a day of the week to the next date for that day
    var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var today = new Date();
    var todaysOrdinal = today.getDay();
    var inputOrdinal = daysOfWeek.indexOf(input);
    var delta = inputOrdinal - todaysOrdinal;
    if(delta < 0) delta += 7;
    return new Date(today.setTime(today.getTime() + delta * 86400000));
  };
}

export default angular.module('shyApp.dayToDate', [])
  .filter('daytodate', dayToDateFilter)
  .name;
