function nextDateForDOW(dayOfWeek) {
  const result = new Date();
  result.setDate(result.getDate() + (dayOfWeek + 6 - result.getDay()) % 7);
  // Clear time so we can add starts and ends
  result.setHours(0);
  result.setMinutes(0);
  result.setSeconds(0);
  return result;
}

function addTime(date, time) {
  const result = new Date(date);
  const hours = parseInt(time.substring(0, 2), 10);
  const mins = parseInt(time.substring(3, 5), 10);
  result.setHours(hours, mins);
  return result;
}

function rowToClass(row) {
  const yogaClass = { ...row };
  yogaClass.startTime = addTime(nextDateForDOW(row.day), row.startTime);
  yogaClass.endTime = addTime(nextDateForDOW(row.day), row.endTime);
  return yogaClass;
}

function nest(flatScheduleItems) {
  const nestedScheduleItems = [];
  let currentLocation;
  let locationIndex = -1; // assume none
  let currentDay;
  let dayIndex;

  for(const i in flatScheduleItems) {
    let row = flatScheduleItems[i];
    if(currentLocation !== row.location) {
      locationIndex++; // zero first time through
      dayIndex = 0; // Start days over for new location
      nestedScheduleItems.push({
        location: row.location,
        days: [
          {
            day: row.day,
            date: nextDateForDOW(row.day),
            classes: [rowToClass(row)]
          }
        ]
      });
    } else {
      if(currentDay !== row.day) {
        dayIndex++;
        nestedScheduleItems[locationIndex].days.push({
          day: row.day,
          date: nextDateForDOW(row.day),
          classes: [rowToClass(row)]
        });
      } else {
        nestedScheduleItems[locationIndex].days[dayIndex].classes.push(rowToClass(row));
      }
      currentDay = row.day;
    }
    currentDay = row.day;
    currentLocation = row.location;
  }
  return nestedScheduleItems;
}

function toPgTime(date) {
  return date.toTimeString().substring(0, 5);
}

// Create dates from times (always uses today's date because it's thrown away later)
function convertDateStringsToDates(schedule) {
  for(let scheduleItem in schedule) {
    const thisScheduleItem = schedule[scheduleItem];
    const today = new Date();
    const midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    thisScheduleItem.startTime = addTime(midnight, thisScheduleItem.startTime);
    thisScheduleItem.endTime = addTime(midnight, thisScheduleItem.endTime);
  }
  return;
}

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

  async scheduleGet() {
    const { data } = await this.$http.get('/api/schedule');
    this.classSchedule = data;
    this.classScheduleNested = nest(data);
    convertDateStringsToDates(this.classSchedule);
    return this.classSchedule;
  }

  async scheduleItemDelete(scheduleItem) {
    await this.$http.delete(`/api/schedule/${scheduleItem._id}`);
    return scheduleItem._id;
  }

  async scheduleItemUpsert(scheduleItem) {
    const scheduleItemClone = { ...scheduleItem };
    scheduleItemClone.startTime = toPgTime(scheduleItem.startTime);
    scheduleItemClone.endTime = toPgTime(scheduleItem.endTime);
    const { data } = await this.$http.put(`/api/schedule/${scheduleItemClone._id}`, scheduleItemClone);
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
      await Promise.all([this.classesGet(true), this.scheduleGet()]);
      return true;
    } catch(err) {
      return false;
    }
  }
}
