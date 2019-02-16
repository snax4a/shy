export class LocationEditorController {
  /*@ngInject*/
  constructor($uibModalInstance, LocationService, locationSelectedForEditing) {
    // Dependencies
    this.$uibModalInstance = $uibModalInstance;
    this.locationService = LocationService;
    this.locationSelectedForEditing = locationSelectedForEditing;

    // Initializations - not in $onInit since not it's own component
    this.submitted = false;
    this.errors = {};
    this.location = { ...this.locationSelectedForEditing };
  }

  async submitLocation(form) {
    this.submitted = true;
    if(form.$valid) {
      // Make a copy of this.user or upsert fails
      let upsertedLocation = { ...this.location };
      upsertedLocation._id = await this.locationService.locationUpsert(upsertedLocation);

      // Graft the edited location back the original
      Object.assign(this.locationSelectedForEditing, upsertedLocation);
      this.$uibModalInstance.close();

      // Success
      return true;
    }
  }

  cancel() {
    if(!this.locationSelectedForEditing._id) {
      this.locationSelectedForEditing.shouldBeDeleted = true;
    }
    this.$uibModalInstance.close();
  }
}
