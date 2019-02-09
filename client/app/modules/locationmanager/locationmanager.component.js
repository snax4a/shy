import { LocationEditorController } from './locationeditor.controller';

export class LocationManagerComponent {
  /*@ngInject*/
  constructor($timeout, $uibModal, LocationService) {
    this.$timeout = $timeout; // calling digest cycle in async functions
    this.locationService = LocationService;
    this.$uibModal = $uibModal;
  }

  $onInit() {
    this.locationsGet();
    this.submitted = false;
  }

  locationRemoveFromList(location) {
    this.locations.splice(this.locations.indexOf(location), 1);
  }

  locationCreate() {
    let location = {
      _id: 0,
      name: '',
      address: '',
      city: '',
      state: 'PA',
      zipCode: '15217',
      map: '',
      street: '',
      directions: '',
      review: '',
      note1: '',
      note2: '',
      active: true
    };

    this.locations.unshift(location);
    this.modalLocationEditor(location);
  }

  async locationDelete(location) {
    await this.locationService.locationDelete(location);
    this.$timeout(() => this.locationRemoveFromList(location));
  }

  classEdit(location) {
    this.modalLocationEditor(location);
  }

  async locationsGet() {
    this.locations = await this.locationService.locationsGet();
  }

  modalLocationEditor(location) {
    let modalDialog = this.$uibModal.open({
      template: require('./locationeditor.pug'),
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      controllerAs: '$ctrl',
      controller: LocationEditorController,
      resolve: {
        locationSelectedForEditing: () => location
      }
    });
    // Stub for anything that needs to happen after closing dialog
    modalDialog.result.then(() => {
      if(location.shouldBeDeleted) this.locationRemoveFromList(location);
    });
  }
}
