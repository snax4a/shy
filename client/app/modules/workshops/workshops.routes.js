export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/workshops', {
    template: '<workshops></workshops>',
    title: 'Schoolhouse Yoga Pittsburgh\'s Workshops',
    resolve: {
      '': (WorkshopService, Cart) => Promise.all([WorkshopService.initialized, Cart.initialized])
    }
  });
}
