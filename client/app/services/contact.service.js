export class ContactService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  async messageSend(message) {
    const response = await this.$http.post('/api/user/message', message);
    return response;
  }
}
