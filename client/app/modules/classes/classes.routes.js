export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/classes', {
    template: '<classes></classes>',
    title: 'Schoolhouse Yoga Pittsburgh - Class Schedules for our 3 schools',
    resolve: {
      '': (LocationService, ClassService) => Promise.all([ClassService.initialized, LocationService.initialized])
    }
  });
}
