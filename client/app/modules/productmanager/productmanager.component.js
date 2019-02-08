import { ProductEditorController } from './producteditor.controller';

export class ProductManagerComponent {
  /*@ngInject*/
  constructor($timeout, $uibModal, ProductService) {
    this.$timeout = $timeout; // calling digest cycle in async functions
    this.productService = ProductService;
    this.$uibModal = $uibModal;
  }

  $onInit() {
    this.productsGet();
    this.submitted = false;
  }

  productRemoveFromList(product) {
    this.products.splice(this.product.indexOf(product), 1);
  }

  productCreate() {
    let product = {
      _id: 0,
      name: '',
      price: 20,
      active: true
    };

    this.products.unshift(product);
    this.modalProductEditor(product);
  }

  async productDelete(product) {
    await this.productService.productDelete(product);
    this.$timeout(() => this.productRemoveFromList(product));
  }

  productEdit(product) {
    this.modalProductEditor(product);
  }

  async productsGet() {
    this.products = await this.productService.productsGet();
  }

  modalProductEditor(product) {
    let modalDialog = this.$uibModal.open({
      template: require('./producteditor.pug'),
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: ProductEditorController,
      resolve: {
        productSelectedForEditing: () => product
      }
    });
    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(() => {
      if(product.shouldBeDeleted) this.productRemoveFromList(product);
    });
  }
}
