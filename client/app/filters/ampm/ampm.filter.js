'use strict';
import angular from 'angular';

export function ampmFilter() {
  return input => {
    let [hour, minutes] = input.split(':');
    let meridien = hour >= 12 ? 'pm' : 'am';
    if(hour > 12) hour = hour - 12;
    let timeString = `${Number.parseInt(hour, 10)}:${minutes}${meridien}`;
    return timeString;
  };
}

export default angular.module('shyApp.ampm', [])
  .filter('ampm', ampmFilter)
  .name;
