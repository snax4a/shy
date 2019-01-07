export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/terms', {
    template: '<terms></terms>',
    title: 'Schoolhouse Yoga Terms of Use'
  });
}
