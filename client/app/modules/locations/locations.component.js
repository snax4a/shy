export class LocationsComponent {
  /*@ngInject*/
  constructor($anchorScroll, $timeout, LocationService) {
    this.$anchorScroll = $anchorScroll;
    this.$timeout = $timeout;
    this.locationService = LocationService;
  }

  $onInit() {
    this.locations = this.locationService.locations;
    this.$timeout(this.$anchorScroll, 100);
  }
}
