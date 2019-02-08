export class ClassesService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.initialized = this.initialize(); // promise used by route
  }

  async classesGet(activeOnly) {
    let suffix = '';
    if(activeOnly) suffix = '/active';
    const { data } = await this.$http.get(`/api/class${suffix}`);
    this.classes = data;
    return this.classes;
  }

  // Undo JSON representation of date
  convertDateStringsToDates(schedule) {
    const flat = !schedule[0].hasOwnProperty('days');
    if(flat) {
      for(let scheduleItem in schedule) {
        const thisScheduleItem = schedule[scheduleItem];
        thisScheduleItem.startTime = new Date(thisScheduleItem.startTime);
        thisScheduleItem.endTime = new Date(thisScheduleItem.endTime);
      }
      return;
    }
    for(let location in schedule) {
      for(let day in schedule[location].days) {
        for(let section in schedule[location].days[day].classes) {
          const thisSection = schedule[location].days[day].classes[section];
          thisSection.startTime = new Date(thisSection.startTime);
          thisSection.endTime = new Date(thisSection.endTime);
        }
      }
    }
  }

  async scheduleGet(flat) {
    const { data } = await this.$http.get(`/api/schedule${flat ? '?flat=true' : ''}`);
    this.classSchedule = data;
    this.convertDateStringsToDates(this.classSchedule);
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
