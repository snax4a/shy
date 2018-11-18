'use strict';
import angular from 'angular';

/*@ngInject*/
export function weekdayFilter() {
  return input => {
    // Converts a day of the week to the next date for that day
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekDays[Number.parseInt(input, 10) - 1];
  };
}

export default angular.module('shyApp.weekday', [])
  .filter('weekday', weekdayFilter)
  .name;
