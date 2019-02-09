export default function routes($routeProvider) {
  'ngInject';
  $routeProvider.when('/', {
    template: '<home></home>',
    title: 'Schoolhouse Yoga',
    resolve: {
      '': (AnnouncementService, HomeService) => Promise.all([AnnouncementService.initialized, HomeService.initialized])
    }
  });
}
