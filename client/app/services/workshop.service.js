export class WorkshopService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.workshops = [];
    this.initialized = this.initialize(); // promise used by route
  }

  async workshopsGet(active) {
    const suffix = active ? '/active' : '';
    const { data } = await this.$http.get(`/api/workshop${suffix}`);
    this.workshops = data;
    return this.workshops;
  }

  async workshopUpsert(workshop) {
    const { data } = await this.$http.put(`/api/workshop/${workshop._id}`, workshop);
    return data.id;
  }

  async workshopDelete(workshop) {
    await this.$http.delete(`/api/workshop/${workshop._id}`);
    return workshop._id;
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
