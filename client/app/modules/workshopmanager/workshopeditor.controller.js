export class WorkshopEditorController {
  /*@ngInject*/
  constructor($uibModalInstance, Upload, FileService, workshopBeforeEdits, WorkshopService, LocationService, ProductService) {
    // Dependencies
    this.$uibModalInstance = $uibModalInstance;
    this.uploadService = Upload;
    this.fileService = FileService;
    this.workshopBeforeEdits = workshopBeforeEdits;
    this.workshopService = WorkshopService;

    // Initializations - not in $onInit since not it's own component
    this.locations = LocationService.locations;
    this.products = ProductService.products;
    this.submitted = false;
    this.errors = {};
    this.uploadProgress = 0;
    this.options = {
      timeSecondsFormat: 'ss',
      timeStripZeroSeconds: true
    };
    this.workshopBeforeEdits = workshopBeforeEdits;
    this.workshop = { ...this.workshopBeforeEdits };
    for(let section in this.workshop.sections) {
      const thisSection = this.workshop.sections[section];
      thisSection.starts = new Date(thisSection.starts);
      thisSection.ends = new Date(thisSection.ends);
    }
  }

  uploadPhoto(file) {
    if(file) {
      this.uploadService.upload({
        url: '/api/file/upload',
        data: { file }
      })
        .then(response => {
          this.workshop.imageId = response.data.id;
        }, response => {
          if(response.status > 0) console.log(`${response.status}: ${response.data}`);
        }, evt => {
          // Math.min fixes IE bug which reports 200% under certain conditions
          this.uploadProgress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total, 10));
        });
    }
  }

  async submitWorkshop(form) {
    this.submitted = true;
    if(form.$valid) {
      try {
        // Set _id to generated one (for inserts) or existing (for updates)
        const _id = await this.workshopService.workshopUpsert(this.workshop);
        // was new, use database assigned id
        if(this.workshop._id === 0) this.workshop._id = _id;
        // Delete the old image so we don't get orphans in the files table
        if(this.workshopBeforeEdits.imageId !== this.workshop.imageId) this.fileService.delete(this.workshopBeforeEdits.imageId);

        // Graft the edited workshop back the original (likely causes digest cycle which helps the await above)
        Object.assign(this.workshopBeforeEdits, this.workshop);
        this.$uibModalInstance.close();
        // Successful - return promise
        return true;
      } catch(error) { // title was already taken
        console.log(error);
        form.title.$setValidity('server', false);
        this.errors.title = error.message;
      }
    }
  }

  // Reset server-side error status
  clearServerError(form, fieldName) {
    form[fieldName].$setValidity('server', true);
  }

  sectionCreate() {
    if(!this.workshop.sections) this.workshop.sections = [];
    this.workshop.sections.push({ locationId: 1, price: 30 });
  }

  sectionDelete(section) {
    this.workshop.sections.splice(this.workshop.sections.indexOf(section), 1);
  }

  cancel() {
    if(!this.workshopBeforeEdits._id) {
      this.workshopBeforeEdits.shouldBeDeleted = true;
    }
    this.$uibModalInstance.close();
  }
}
