// This dialog is a viewer rather than editor but following the name convention
export class OrderEditorController {
  /*@ngInject*/
  constructor($uibModalInstance, OrderService, order) {
    // Dependencies
    this.$uibModalInstance = $uibModalInstance;
    this.orderService = OrderService;
    this.order = order; // No need to clone it if we're not editing
    // Note: ProductService not needed as there are no product picklists
  }

  cancel() {
    this.$uibModalInstance.close();
  }
}
