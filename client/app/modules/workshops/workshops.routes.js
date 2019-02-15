export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/workshops', {
    template: '<workshops></workshops>',
    title: 'Schoolhouse Yoga Workshops',
    resolve: {
      '': (WorkshopService, Cart) => Promise.all([WorkshopService.initialized, Cart.initialized])
    }
  });
}
