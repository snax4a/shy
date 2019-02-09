import angular from 'angular'; // for angular.copy

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
    this.location = {};
    angular.copy(this.locationSelectedForEditing, this.location);
  }

  async submitLocation(form) {
    this.submitted = true;
    if(form.$valid) {
      // Make a copy of this.user or upsert fails
      let upsertedLocation = {};
      angular.copy(this.location, upsertedLocation);

      upsertedLocation._id = await this.locationService.locationUpsert(upsertedLocation);

      // Graft the edited location back the original
      angular.extend(this.locationSelectedForEditing, upsertedLocation);
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
