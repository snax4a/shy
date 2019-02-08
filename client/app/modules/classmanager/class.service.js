export class ClassService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.initialized = this.initialize(); // promise used by route
  }

  async initialize() {
    try {
      await this.classesGet();
      return true;
    } catch(err) {
      return false;
    }
  }

  async classesGet(activeOnly) {
    let suffix = '';
    if(activeOnly) suffix = '/active';
    const { data } = await this.$http.get(`/api/class${suffix}`);
    return data;
  }

  async classDelete(thisClass) {
    await this.$http.delete(`/api/class/${thisClass._id}`);
    return true;
  }

  async classUpsert(thisClass) {
    const { data } = await this.$http.put(`/api/class/${thisClass._id}`, thisClass);
    // Return new or existing _id
    return thisClass._id === 0 ? data._id : thisClass._id;
  }
}
