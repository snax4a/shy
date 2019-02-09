export class LocationService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.initialized = this.initialize(); // promise used by route
  }

  async initialize() {
    try {
      await this.locationsGet();
      return true;
    } catch(err) {
      return false;
    }
  }

  async locationsGet(activeOnly) {
    let suffix = '';
    if(activeOnly) suffix = '/active';
    const { data } = await this.$http.get(`/api/location${suffix}`);
    return data;
  }

  async locationDelete(location) {
    await this.$http.delete(`/api/location/${location._id}`);
    return true;
  }

  async locationUpsert(location) {
    const { data } = await this.$http.put(`/api/location/${location._id}`, location);
    // Return new or existing _id
    return location._id === 0 ? data._id : location._id;
  }
}
