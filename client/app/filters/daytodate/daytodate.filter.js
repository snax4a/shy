import angular from 'angular';

/*@ngInject*/
export function dayToDateFilter() {
  return input => {
    // Converts a day of the week to the next date for that day
    const result = new Date();
    result.setDate(result.getDate() + (input + 7 - result.getDay()) % 7);
    return result;
  };
}

export default angular.module('shyApp.dayToDate', [])
  .filter('daytodate', dayToDateFilter)
  .name;
