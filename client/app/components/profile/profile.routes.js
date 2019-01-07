export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/profile', {
    template: '<profile></profile>',
    authenticate: true,
    title: 'Schoolhouse Yoga User Profile Settings'
  });
}
