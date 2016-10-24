'use strict';
import angular from 'angular';

/*@ngInject*/
export function dayToDateFilter() {
  return input => {
    // Converts a day of the week to the next date for that day
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date();
    const todaysOrdinal = today.getDay();
    const inputOrdinal = daysOfWeek.indexOf(input);
    let delta = inputOrdinal - todaysOrdinal;
    if(delta < 0) delta += 7;
    return new Date(today.setTime(today.getTime() + delta * 86400000));
  };
}

export default angular.module('shyApp.dayToDate', [])
  .filter('daytodate', dayToDateFilter)
  .name;
