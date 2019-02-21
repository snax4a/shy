export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/locations', {
    template: '<locations></locations>',
    title: 'Schoolhouse Yoga Pittsburgh Locations',
    resolve: {
      '': LocationService => LocationService.initialized
    }
  });
}
