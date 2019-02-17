export class LocationEditorController {
  /*@ngInject*/
  constructor($timeout, $uibModalInstance, LocationService, locationBeforeEdits) {
    // Dependencies
    this.$timeout = $timeout; // force digest cycle
    this.$uibModalInstance = $uibModalInstance;
    this.locationService = LocationService;
    this.locationBeforeEdits = locationBeforeEdits;

    // Initializations - not in $onInit since not it's own component
    this.submitted = false;
    this.errors = {};
    this.location = { ...this.locationBeforeEdits };
  }

  async submitLocation(form) {
    this.submitted = true;
    if(form.$valid) {
      try {
        // Make a copy of this.user or upsert fails
        this.location._id = await this.locationService.locationUpsert(this.location);

        // Graft the edited location back the original
        Object.assign(this.locationBeforeEdits, this.location);
        this.$uibModalInstance.close();

        // Success
        return true;
      } catch(err) {
        this.$timeout(() => {
          form.locationName.$setValidity('server', false);
          this.errors.locationName = 'That location name is already being used. Please choose another.';
        });
      }
    }
  }

  cancel() {
    if(!this.locationBeforeEdits._id) {
      this.locationBeforeEdits.shouldBeDeleted = true;
    }
    this.$uibModalInstance.close();
  }
}
