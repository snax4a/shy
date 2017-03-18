'use strict';
import angular from 'angular';

export function upcomingFilter() {
  // Use ES6 filter
  return items => items.filter(item => item.expires !== null && new Date(item.expires) > new Date());
}

export default angular.module('shyApp.upcoming', [])
  .filter('upcoming', upcomingFilter)
  .name;
