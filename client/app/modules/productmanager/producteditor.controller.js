export class ProductEditorController {
  /*@ngInject*/
  constructor($uibModalInstance, ProductService, productSelectedForEditing) {
    // Dependencies
    this.$uibModalInstance = $uibModalInstance;
    this.productService = ProductService;
    this.productSelectedForEditing = productSelectedForEditing;
    this.productSelectedForEditing.price = this.productSelectedForEditing.price * 1;

    // Initializations - not in $onInit since not it's own component
    this.submitted = false;
    this.errors = {};
    this.product = { ...this.productSelectedForEditing };
  }

  async submitProduct(form) {
    this.submitted = true;
    if(form.$valid) {
      // Make a copy of this.user or upsert fails
      let upsertedProduct = { ...this.product };
      upsertedProduct._id = await this.productService.productUpsert(upsertedProduct);

      // Graft the edited product back the original
      Object.assign(this.productSelectedForEditing, upsertedProduct);
      this.$uibModalInstance.close();

      // Success
      return true;
    }
  }

  cancel() {
    if(!this.productSelectedForEditing._id) {
      this.productSelectedForEditing.shouldBeDeleted = true;
    }
    this.$uibModalInstance.close();
  }
}
