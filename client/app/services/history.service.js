export class HistoryService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  // Assumes date only - midnight in local time zone
  localISODate(date) {
    return date.toISOString().substring(0, 10);
  }

  attendeesGet(attended, locationId, classId, teacherId) {
    // If parameters are incomplete, ignore (but resolve the promise)
    if(!!attended && !!locationId && !!classId && !!teacherId) {
      const localISODate = this.localISODate(attended);
      return this.$http.get(`/api/history/attendees/?attended=${localISODate}&locationid=${locationId}&teacherid=${teacherId}&classid=${classId}`)
        .then(response => response.data);
    } else {
      return Promise.resolve([]);
    }
  }

  // Separate the UI elements
  attendeeDelete(attendance) {
    attendance.type = 'A';
    return this.historyItemDelete(attendance);
  }

  historyItemAdd(historyItem) {
    return this.$http.post('/api/history', historyItem);
  }

  historyItemDelete(historyItem) {
    return this.$http.delete(`/api/history/${historyItem._id}?type=${historyItem.type}`);
  }

  historyItemUpdate(historyItem) {
    return this.$http.put(`/api/history/${historyItem._id}`, historyItem);
  }

  historyItemsForUserGet(userId) {
    return this.$http.get(`/api/history/${userId}`)
      .then(response => response.data);
  }
}
