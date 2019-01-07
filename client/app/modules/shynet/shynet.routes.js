export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/shynet', {
    url: '/shynet',
    template: '<shynet></shynet>',
    authenticate: 'teacher',
    title: 'SHYnet',
    resolve: {
      '': (TeachersService, ClassesService, LocationsService) => Promise.all([TeachersService.initialized, ClassesService.initialized, LocationsService.initialized])
    }
  });
}
