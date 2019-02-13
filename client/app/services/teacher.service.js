export class TeacherService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.initialized = this.initialize(); // promise used by route
  }

  async getTeachers() {
    const { data } = await this.$http.get('/api/user/teachers');
    this.teachers = data;
    console.log(this.teachers);
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
