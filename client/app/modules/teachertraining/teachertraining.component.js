export class TeacherTrainingComponent {
  constructor($anchorScroll, $timeout, Cart) {
    'ngInject';
    this.$anchorScroll = $anchorScroll;
    this.$timeout = $timeout;
    this.Cart = Cart;
  }

  $onInit() {
    this.paymentTerms = '98'; // product ID for teacher training (one-time fee)
    this.$timeout(this.$anchorScroll, 100);
  }

  register() {
    if(this.agreed) {
      this.Cart.addItem(parseInt(this.paymentTerms, 10));
    }
  }
}
