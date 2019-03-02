export class DashboardService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  reportGet(reportName) {
    return this.$http.get(`/api/report/?name=${reportName}`)
      .then(response => response.data);
  }

  csvGet() {
    return this.$http.get('/api/report/csv')
      .then(response => {
        const linkElement = document.createElement('a');
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        linkElement.setAttribute('href', url);
        linkElement.setAttribute('download', 'teachers.csv');
        const clickEvent = new MouseEvent('click',
          {
            view: window,
            bubbles: true,
            cancelable: false
          });
        linkElement.dispatchEvent(clickEvent);
        return true;
      });
  }
}
