'use strict';

export class LocationsService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.initialized = this.initialize(); // promise used by route
  }

  async getLocations() {
    const { data } = await this.$http.get('/assets/data/locations.json');
    this.locations = data;
    return this.locations;
  }

  async initialize() {
    try {
      await this.getLocations();
      return true;
    } catch(err) {
      return false;
    }
  }
}
