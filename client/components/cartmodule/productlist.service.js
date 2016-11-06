'use strict';
import angular from 'angular';

export class ProductList {
  /*@ngInject*/
  constructor($http, $log) {
    this.$http = $http;
    this.$log = $log;
  }

  // Load an array of products from the products.json file
  // Called by CartRun
  loadProductsFromJson() {
    this.$http.get('/assets/data/products.json')
      .then(response => {
        this.products = response.data;
      });
  }

  // Iterates through array of products to retrieve one with matching id
  lookup(id) {
    let selectedProduct = {};
    angular.forEach(this.products, product => {
      if(product.id == id) {
        selectedProduct = product;
      }
    });
    return selectedProduct;
  }
}
