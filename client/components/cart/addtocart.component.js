'use strict';

export class AddToCartComponent {
  /*@ngInject*/
  constructor(Cart) {
    this.Cart = Cart;
  }

  // Implement this way so we can trace the flow
  // Later, replace $ctrl.addItem() in addtocart.pug with Cart.addItem()
  addItem(productID) {
    console.log(`Adding product with ID ${productID} from addtocart.component.js:13`);
    this.Cart.addItem(productID, 1);
  }
}

