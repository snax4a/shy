export class LocationsComponent {
  /*@ngInject*/
  constructor($anchorScroll, $timeout, LocationsService) {
    this.$anchorScroll = $anchorScroll;
    this.$timeout = $timeout;
    this.LocationsService = LocationsService;
  }

  $onInit() {
    this.locations = this.LocationsService.locations;
    this.$timeout(this.$anchorScroll, 50);
  }
}
