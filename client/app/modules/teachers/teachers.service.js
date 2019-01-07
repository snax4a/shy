export class TeachersService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.initialized = this.initialize(); // promise used by route
  }

  async getTeachers() {
    const { data } = await this.$http.get('/assets/data/teachers.json');
    this.teachers = data;
    return this.teachers;
  }

  async initialize() {
    try {
      await this.getTeachers();
      return true;
    } catch(err) {
      return false;
    }
  }
}
