import angular from 'angular';

export function upcomingFilter() {
  // Use ES6 filter
  return items => {
    if(items === undefined) items = []; // in case there's no data back yet
    return items.filter(item => item.expires !== null && new Date(item.expires) > new Date());
  };
}

export default angular.module('shyApp.upcoming', [])
  .filter('upcoming', upcomingFilter)
  .name;
