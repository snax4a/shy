export class TeacherService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.teachers = [];
    this.initialized = this.initialize(); // promise used by route
  }

  async initialize() {
    try {
      this.teachers = await this.teachersGet();
      return true;
    } catch(err) {
      return false;
    }
  }

  async teachersGet() {
    const { data } = await this.$http.get('/api/user/teachers');
    return data;
  }
}
