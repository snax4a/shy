'use strict';
import angular from 'angular';
import ngCart from '../ngCart'; // Do I need {}?

export class addToCartComponent {
  /*@ngInject*/
  constructor() {
    this.ngCart = ngCart;
    console.log('addtocart component constructor');
  }

  // Implement this way so we can trace the flow
  // Later, replace $ctrl.addItem() in addtocart.pug with Cart.addItem()
  addItem(productID) {
    console.log(`Adding product with ID ${productID}`);
    this.ngCart.addItem(productID, 'Testy McTest', 100, 1);
  }
}

export default angular.module('shyApp.addtocart', [ngCart])
  .component('addtocart', {
    template: require('./addtocart.pug'),
    bindings: { product: '<' },
    controller: addToCartComponent
  })
  .name;
