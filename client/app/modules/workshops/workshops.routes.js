export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/workshops', {
    template: '<workshops></workshops>',
    title: 'Schoolhouse Yoga Workshops',
    resolve: {
      '': (Cart, WorkshopService) => Promise.all([Cart.initialized, WorkshopService.initialized])
    }
  });
}
