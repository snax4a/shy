'use strict';

export class NewsletterService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  async subscribe(subscriber) {
    const { data } = await this.$http.post('/api/users/subscribe', subscriber);
    return data;
  }
}
