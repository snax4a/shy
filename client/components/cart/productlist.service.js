'use strict';
import angular from 'angular';

export class ProductList {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
    this.$http.get('/assets/data/products.json')
      .then(response => {
        this.products = response.data;
      });
  }

  lookup(id) {
    let selectedProduct = {};
    angular.forEach(this.products, product => {
      if(product.id === id) {
        selectedProduct = product;
      }
    });
    return selectedProduct;
  }
}
