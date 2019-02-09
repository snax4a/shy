export class ProductService {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.initialized = this.initialize(); // promise used by route
  }

  async initialize() {
    try {
      await this.productsGet();
      return true;
    } catch(err) {
      return false;
    }
  }

  async productsGet(activeOnly) {
    let suffix = '';
    if(activeOnly) suffix = '/active';
    const { data } = await this.$http.get(`/api/product${suffix}`);
    return data;
  }

  async productDelete(product) {
    await this.$http.delete(`/api/product/${product._id}`);
    return true;
  }

  async productUpsert(product) {
    const { data } = await this.$http.put(`/api/product/${product._id}`, product);
    // Return new or existing _id
    return product._id === 0 ? data._id : product._id;
  }
}
