export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/shynet', {
    url: '/shynet',
    template: '<shynet></shynet>',
    authenticate: 'teacher',
    title: 'SHYnet',
    resolve: {
      '': (TeacherService, ClassService, LocationService) => Promise.all([TeacherService.initialized, ClassService.initialized, LocationService.initialized])
    }
  });
}
