export class ClassService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.classSchedule = [];
    this.classes = [];
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

  nest(flatScheduleItems) {
    let nestedScheduleItems = [];
    let currentLocation;
    let locationIndex = -1; // assume none
    let currentDay;
    let dayIndex;

    for(let i in flatScheduleItems) {
      let row = flatScheduleItems[i];
      if(currentLocation !== row.location) {
        locationIndex++; // zero first time through
        dayIndex = 0; // Start days over for new location
        nestedScheduleItems.push({
          location: row.location,
          days: [
            {
              day: row.day,
              classes: [
                {
                  title: row.title,
                  teacher: row.teacher,
                  startTime: row.startTime,
                  endTime: row.endTime,
                  canceled: row.canceled
                }
              ]
            }
          ]
        });
      } else {
        if(currentDay !== row.day) {
          dayIndex++;
          nestedScheduleItems[locationIndex].days.push({
            day: row.day,
            classes: [
              {
                title: row.title,
                teacher: row.teacher,
                startTime: row.startTime,
                endTime: row.endTime,
                canceled: row.canceled
              }
            ]
          });
        } else {
          nestedScheduleItems[locationIndex].days[dayIndex].classes.push({
            title: row.title,
            teacher: row.teacher,
            startTime: row.startTime,
            endTime: row.endTime,
            canceled: row.canceled
          });
        }
        currentDay = row.day;
      }
      currentDay = row.day;
      currentLocation = row.location;
    }
    return nestedScheduleItems;
  }

  async scheduleGet() {
    const { data } = await this.$http.get('/api/schedule');
    this.classSchedule = data;
    this.classScheduleNested = this.nest(data);
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

  async classDelete(thisClass) {
    await this.$http.delete(`/api/class/${thisClass._id}`);
    return true;
  }

  async classUpsert(thisClass) {
    const { data } = await this.$http.put(`/api/class/${thisClass._id}`, thisClass);
    // Return new or existing _id
    return thisClass._id === 0 ? data._id : thisClass._id;
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
