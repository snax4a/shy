export default function($routeProvider) {
  'ngInject';
  $routeProvider.when('/teachertraining', {
    template: '<teachertraining></teachertraining>',
    title: 'Pittsburgh Yoga Teacher Training - 200 Hour Program - Yoga Alliance Certified',
    resolve: {
      '': Cart => Cart.initialized
    }
  });
}
