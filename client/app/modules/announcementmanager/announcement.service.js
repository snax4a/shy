export class AnnouncementService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.announcementList = [];
    this.initialized = this.initialize(); // promise used by routes
  }

  async initialize() {
    try {
      this.announcementList = await this.announcementsGet();
      return true;
    } catch(err) {
      return false;
    }
  }

  async announcementsGet(flat) {
    const { data } = await this.$http.get(`/api/announcement${flat ? '?flat=true' : ''}`);
    return data;
  }

  async announcementDelete(announcement) {
    await this.$http.delete(`/api/announcement/${announcement._id}`);
    return true;
  }

  async announcementUpsert(announcement) {
    const { data } = await this.$http.put(`/api/announcement/${announcement._id}`, announcement);
    // Return new or existing _id
    return announcement._id === 0 ? data._id : announcement._id;
  }
}
