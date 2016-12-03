'use strict';
import products from '../../assets/data/products.json';

export class ProductList {
  constructor() {
    this.products = [];
  }

  // Load an array of products from the products.json file
  // Called by CartRun
  loadProductsFromJson() {
    this.products = products;
  }

  // Iterates through array of products to retrieve one with matching id
  lookup(id) {
    return this.products.find(product => product.id === parseInt(id, 10));
  }
}
