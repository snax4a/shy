export default function routes($routeProvider) {
  'ngInject';
  $routeProvider.when('/admin', {
    url: '/admin',
    template: '<admin></admin>',
    authenticate: 'admin',
    title: 'Schoolhouse Yoga Admin',
    resolve: {
      '': (TeachersService, ClassesService, LocationsService) => Promise.all([TeachersService.initialized, ClassesService.initialized, LocationsService.initialized])
    }
  });
}
