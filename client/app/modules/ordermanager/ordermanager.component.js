import { OrderEditorController } from './ordereditor.controller';

export class OrderManagerComponent {
  /*@ngInject*/
  constructor($timeout, $uibModal, paginationService, OrderService) {
    this.$timeout = $timeout; // Pull async function results into digest cycle
    this.$uibModal = $uibModal;
    this.paginationService = paginationService; // dirPagination
    this.orderService = OrderService;
  }

  $onInit() {
    this.submitted = false; // for search form
    this.orders = [];
  }

  // Search by order number or email (purchaser or recipient)
  search(form) {
    this.submitted = true;
    if(form.$valid) {
      this.orderService.search(this.searchText)
        .then(orders => {
          this.orders = orders;
          this.paginationService.setCurrentPage('orders', 1); // reset to tab 1
        });
    }
  }

  modalOrderEditor(order) {
    let modalDialog = this.$uibModal.open({
      template: require('./ordereditor.pug'),
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: OrderEditorController,
      resolve: {
        order: () => order
      }
    });
    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(() => {
    }, () => {
      console.log('Backdrop click');
    });
  }

  orderEdit(order) {
    this.modalOrderEditor(order);
  }
}
