import angular from 'angular';

/*@ngInject*/
export function dayToDateFilter() {
  return input => {
    // Converts a day of the week to the next date for that day
    const today = new Date();
    const todaysOrdinal = today.getDay();
    let delta = input - todaysOrdinal - 1;
    if(delta < 0) delta += 7;
    return new Date(today.setTime(today.getTime() + delta * 86400000));
  };
}

export default angular.module('shyApp.dayToDate', [])
  .filter('daytodate', dayToDateFilter)
  .name;
