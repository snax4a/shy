export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/teachers', {
    template: '<teachers></teachers>',
    title: 'Schoolhouse Yoga Pittburgh\'s Teachers',
    resolve: {
      '': TeacherService => TeacherService.initialized
    }
  });
}
