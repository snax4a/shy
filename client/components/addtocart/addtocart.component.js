'use strict';
import angular from 'angular';

export class addToCartComponent {
  /*@ngInject*/
  constructor(Cart) {
    this.Cart = Cart;
  }

  // Implement this way so we can trace the flow
  // Later, replace $ctrl.addItem() in addtocart.pug with Cart.addItem()
  addItem(productID) {
    console.log(`Adding product with ID ${productID} from addtocart.component.js:13`);
    this.Cart.addItem(productID, 'Testy McTest', 100, 1);
  }
}

export default angular.module('shyApp.addtocart', [])
  .component('addtocart', {
    template: require('./addtocart.pug'),
    bindings: { product: '<' },
    controller: addToCartComponent
  })
  .name;
