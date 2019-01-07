export default function routes($routeProvider) {
  'ngInject';

  $routeProvider.when('/', {
    template: '<home></home>',
    title: 'Schoolhouse Yoga',
    resolve: {
      '': HomeService => HomeService.initialized
    }
  });
}
