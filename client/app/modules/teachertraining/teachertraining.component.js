'use strict';

export class TeacherTrainingComponent {
  constructor(Cart) {
    'ngInject';
    this.Cart = Cart;
  }

  $onInit() {
    this.paymentTerms = '98'; // product ID for teacher training (one-time fee)
  }

  register() {
    if(this.agreed) {
      this.Cart.addItem(parseInt(this.paymentTerms, 10));
    }
  }
}
