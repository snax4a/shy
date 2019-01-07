export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/signup', {
    template: '<signup></signup>',
    title: 'Schoolhouse Yoga Account Signup'
  });
}
