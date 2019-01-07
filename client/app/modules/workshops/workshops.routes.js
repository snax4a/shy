export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/workshops', {
    template: '<workshops></workshops>',
    title: 'Schoolhouse Yoga Workshops',
    resolve: {
      '': (Cart, WorkshopsService) => Promise.all([Cart.initialized, WorkshopsService.initialized])
    }
  });
}
