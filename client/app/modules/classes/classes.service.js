'use strict';

export class ClassesService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.initialized = this.initialize(); // promise used by route
  }

  async classesGet() {
    const { data } = await this.$http.get('/assets/data/classes.json');
    this.classes = data;
    return this.classes;
  }

  async scheduleGet(flat) {
    const { data } = await this.$http.get(`/api/schedule${flat ? '?flat=true' : ''}`);
    this.classSchedule = data;
    return this.classSchedule;
  }

  async scheduleItemDelete(scheduleItem) {
    await this.$http.delete(`/api/schedule/${scheduleItem._id}`);
    return scheduleItem._id;
  }

  async scheduleItemUpsert(scheduleItem) {
    const { data } = await this.$http.put(`/api/schedule/${scheduleItem._id}`, scheduleItem);
    return scheduleItem._id === 0 ? data._id : scheduleItem._id;
  }

  async initialize() {
    try {
      await Promise.all([this.classesGet(), this.scheduleGet()]);
      return true;
    } catch(err) {
      return false;
    }
  }
}
