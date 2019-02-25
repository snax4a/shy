export class DashboardService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  async reportGet(reportName) {
    const { data } = await this.$http.get(`/api/report/?name=${reportName}`);
    return data;
  }

  // Undo JSON representation of date
  // convertDateStringsToDates(schedule) {
  //   const flat = !schedule[0].hasOwnProperty('days');
  //   if(flat) {
  //     for(let scheduleItem in schedule) {
  //       const thisScheduleItem = schedule[scheduleItem];
  //       thisScheduleItem.startTime = new Date(thisScheduleItem.startTime);
  //       thisScheduleItem.endTime = new Date(thisScheduleItem.endTime);
  //     }
  //     return;
  //   }
  //   for(let location in schedule) {
  //     for(let day in schedule[location].days) {
  //       for(let section in schedule[location].days[day].classes) {
  //         const thisSection = schedule[location].days[day].classes[section];
  //         thisSection.startTime = new Date(thisSection.startTime);
  //         thisSection.endTime = new Date(thisSection.endTime);
  //       }
  //     }
  //   }
  // }
}
