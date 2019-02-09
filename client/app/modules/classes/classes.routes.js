export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/classes', {
    template: '<classes></classes>',
    title: 'Schoolhouse Yoga Classes',
    resolve: {
      '': (LocationService, ClassService) => Promise.all([ClassService.initialized, LocationService.initialized])
    }
  });
}
