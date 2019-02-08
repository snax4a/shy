export default function routes($routeProvider) {
  'ngInject';
  $routeProvider.when('/admin', {
    url: '/admin',
    template: '<admin></admin>',
    authenticate: 'admin',
    title: 'Schoolhouse Yoga Admin',
    resolve: {
      '': (TeachersService, ClassesService, LocationsService, ProductService) => Promise.all([TeachersService.initialized, ClassesService.initialized, LocationsService.initialized, ProductService.initialized])
    }
  });
}
