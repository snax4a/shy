export class DashboardService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  reportGet(reportName) {
    return this.$http.get(`/api/report/?name=${reportName}`)
      .then(response => response.data);
  }
}
