export class ProductEditorController {
  /*@ngInject*/
  constructor($timeout, $uibModalInstance, ProductService, productBeforeEdits) {
    // Dependencies
    this.$timeout = $timeout;
    this.$uibModalInstance = $uibModalInstance;
    this.productService = ProductService;
    this.productBeforeEdits = productBeforeEdits;
    this.productBeforeEdits.price = this.productBeforeEdits.price * 1;

    // Initializations - not in $onInit since not it's own component
    this.submitted = false;
    this.errors = {};
    this.product = { ...this.productBeforeEdits };
  }

  async submitProduct(form) {
    this.submitted = true;
    if(form.$valid) {
      try {
        // Make a copy of this.user or upsert fails
        this.product._id = await this.productService.productUpsert(this.product);

        // Graft the edited product back the original
        Object.assign(this.productBeforeEdits, this.product);
        this.$uibModalInstance.close();

        // Success
        return true;
      } catch(err) {
        this.$timeout(() => {
          form.productName.$setValidity('server', false);
          this.errors.productName = 'That product name is already being used. Please choose another.';
        });
      }
    }
  }

  cancel() {
    if(!this.productBeforeEdits._id) {
      this.productBeforeEdits.shouldBeDeleted = true;
    }
    this.$uibModalInstance.close();
  }
}
