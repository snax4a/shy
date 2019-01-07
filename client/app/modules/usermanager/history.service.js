export class HistoryService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  // Assumes date only - midnight in local time zone
  localISODate(date) {
    return date.toISOString().substring(0, 10);
  }

  attendeesGet(classDate, location, classTitle, teacher) {
    // If parameters are incomplete, ignore
    if(!!classDate && !!location && !!classTitle && !!teacher) {
      const localISODate = this.localISODate(classDate);
      return this.$http.get(`/api/history/attendees/?attended=${localISODate}&location=${encodeURI(location)}&teacher=${encodeURI(teacher)}&classTitle=${encodeURI(classTitle)}`)
        .then(response => response.data);
    } else {
      return Promise.resolve([]);
    }
  }

  // Separate the UI elements
  attendeeDelete(attendee) {
    return this.$http.delete(`/api/history/${attendee._id}?type=A`)
      //.then(() => true)
      .catch(response => console.error('Error deleting attendee', response));
  }
}
