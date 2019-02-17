export class OrderService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  search(searchText) {
    const encodedSearchText = window.encodeURIComponent(searchText);
    return this.$http.get(`/api/order/?find=${encodedSearchText}`)
      .then(response => response.data);
  }
}
