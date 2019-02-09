export class WorkshopsService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.initialized = this.initialize(); // promise used by route
  }

  async getWorkshops() {
    const { data } = await this.$http.get('/assets/data/workshops.json');
    this.workshops = data;
    return this.workshops;
  }

  async initialize() {
    try {
      await this.getWorkshops();
      return true;
    } catch(err) {
      return false;
    }
  }
}
