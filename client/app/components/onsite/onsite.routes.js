export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/onsite', {
    template: '<onsite></onsite>',
    title: 'Schoolhouse Yoga Onsite'
  });
}
