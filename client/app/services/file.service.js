export class FileService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  async delete(fileId) {
    const { message } = await this.$http.delete(`/api/file/${fileId}`);
    return message;
  }
}
