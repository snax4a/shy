'use strict';

export class LocationsComponent {
  /*@ngInject*/
  constructor(LocationsService) {
    this.LocationsService = LocationsService;
  }

  $onInit() {
    this.locations = this.LocationsService.locations;
  }
}

