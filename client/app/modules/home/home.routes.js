export default function routes($routeProvider) {
  'ngInject';
  $routeProvider.when('/', {
    template: '<home></home>',
    title: 'Schoolhouse Yoga Pittsburgh: Squirrel Hill, East Liberty, Ross Park',
    resolve: {
      '': (AnnouncementService, HomeService) => Promise.all([AnnouncementService.initialized, HomeService.initialized])
    }
  });
}
