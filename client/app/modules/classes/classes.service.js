'use strict';

export class ClassesService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.initialized = this.initialize(); // promise used by route
  }

  async getClasses() {
    const { data } = await this.$http.get('/assets/data/classes.json');
    this.classes = data;
    return this.classes;
  }

  async getSchedule() {
    const { data } = await this.$http.get('/api/schedule');
    this.classSchedule = data;
    return this.classSchedule;
  }

  async initialize() {
    try {
      await Promise.all([this.getClasses(), this.getSchedule()]);
      return true;
    } catch(err) {
      return false;
    }
  }
}
